from vnstock import Vnstock
from vnstock.explorer.vci import Company
import pandas as pd
import numpy as np
import pandas_ta as ta
import redis    
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_general_information(company_overview):
    general_info ={}
    
    general_info['issue_share']= company_overview.get('issue_share', 'N/A').values[-1]
    general_info['ISIN_code']='VN000000PVS0'
    general_info['exchange_code']=company_overview['exchange'].values[-1]
    general_info['industry']=company_overview.get('industry').values[-1]

    general_info['no._of_employees']=int(company_overview.get('no_employees', 'N/A').values[-1])
   
    return general_info

def get_company_detail(company_overview):
    company_detail={}
    
    company_detail['address']='Viet Nam'
    company_detail['phone_number']= '028 7308 8888'    
    company_detail['website']=company_overview.get('website', 'N/A').values[-1]
    company_detail['company_short_name']=company_overview.get('short_name', 'N/A').values[-1]
    # company_detail['charter_capital']=company_overview.get('charter_capital', 'N/A').values[-1]
    
    return company_detail

def caculate_share_detail(df,company_overview,start_date,end_date):
    market_data= Vnstock().stock(symbol='VNINDEX', source='VCI')
    market_df= market_data.quote.history(start=start_date, end=end_date, interval="1D")
    
    
    share_detail = {}
    
    share_detail['close_price'] = df["close"].iloc[-1]
    df_52wk = df[df["time"] >= (pd.to_datetime(end_date) - pd.Timedelta(days=365))]
    share_detail['52_wk_high'] = df_52wk["high"].max() if not df_52wk.empty else np.nan
    share_detail['52_wk_low'] = df_52wk["low"].min() if not df_52wk.empty else np.nan
    
    
    share_detail['5_day_average_volume'] = df["volume"].rolling(window=5, min_periods=1).mean().iloc[-1]
    share_detail['10_day_average_volume']= df["volume"].rolling(window=10, min_periods=1).mean().iloc[-1]
    share_detail['currency'] = 'VND'
    # share_detail['shares_outstanding'] = folat(shares_outstanding) if isinstance(shares_outstanding, float) and not np.isnan(shares_outstanding) else 0
    
    df = df[['time', 'close']].rename(columns={'close': 'Stock'})
    market_df = market_df[['time', 'close']].rename(columns={'close': 'Market'})
    
    merge_df = pd.merge(df, market_df, on="time", how="inner")

    merge_df['Stock Return'] = np.log(merge_df['Stock'] / merge_df['Stock'].shift(1))
    merge_df['Market Return'] = np.log(merge_df['Market'] / merge_df['Market'].shift(1))

    merge_df = merge_df.dropna()

    cov_matrix = merge_df[['Stock Return', 'Market Return']].cov()
    share_detail['beta_value'] = cov_matrix.loc['Stock Return', 'Market Return'] / merge_df['Market Return'].var()
    share_detail['outstanding_share'] = company_overview['outstanding_share'].values[-1]
    
    return share_detail
    
def caculate_percentage_change(df,date):
    date= pd.to_datetime(date)
    percentage_change = {}
    def percentage_change(days):
        if len(df) < days:
            return np.nan
        return round(((df["close"].iloc[-1] - df["close"].iloc[-days]) / df["close"].iloc[-days]) * 100,2)
    
    percent_change = {
        "1_day": percentage_change(1),
        "5_day": percentage_change(5),
        "3_months": percentage_change(63),
        "6_months": percentage_change(126),
        "month_to_date": percentage_change(df[df["time"].dt.month == date.month].shape[0]),
        "year_to_date": percentage_change(df[df["time"].dt.year == date.year].shape[0]),
    }
    
    return percent_change
    
def caculte_analyst_outlook(df):
    df['MA10'] = df['close'].rolling(window=10).mean()
    df['MA20'] = df['close'].rolling(window=20).mean()
    df['MA50'] = df['close'].rolling(window=50).mean()

    #Tính BB
    middle_bb = df['close'].rolling(window=20).mean().iloc[-1]
    std_dev = df['close'].rolling(window=20).std().iloc[-1]
    df['Middle_BB'] = middle_bb
    df['Upper_BB'] = middle_bb + 2 * std_dev
    df['lower_BB'] = middle_bb - 2 * std_dev

    # Tính RSI
    df['RSI'] = ta.rsi(close=df['close'], length=14)

    # Tính MACD
    df['MACD'] = df['close'].ewm(span=12, adjust=False).mean() - df['close'].ewm(span=26, adjust=False).mean()
    df['Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()

    # Tính MFI
    # 1. Typical Price
    df['Typical_Price'] = (df['high'] + df['low'] + df['close']) / 3

    # 2. Raw Money Flow
    df['Raw_Money_Flow'] = df['Typical_Price'] * df['volume']

    # 3. Money Flow Positive/Negative
    df['Positive_Flow'] = df['Raw_Money_Flow'].where(df['Typical_Price'] > df['Typical_Price'].shift(1), 0)
    df['Negative_Flow'] = df['Raw_Money_Flow'].where(df['Typical_Price'] < df['Typical_Price'].shift(1), 0)

    # 4. Rolling Sum for 14 periods
    df['Positive_Flow_Sum'] = df['Positive_Flow'].rolling(window=14).sum()
    df['Negative_Flow_Sum'] = df['Negative_Flow'].rolling(window=14).sum()

    # 5. Money Flow Ratio
    df['Money_Flow_Ratio'] = df['Positive_Flow_Sum'] / df['Negative_Flow_Sum']

    # 6. MFI Calculation
    df['MFI'] = 100 - (100 / (1 + df['Money_Flow_Ratio']))

    # Khối lượng
    df['volume_avg'] = df['volume'].rolling(window=20).mean()

    # Lấy dữ liệu ngày hiện tại
    last_index = df.last_valid_index()


    # Đưa ra tín hiệu giao dịch
    buy_criteria = [
        df.loc[last_index, 'MA10'] > df.loc[last_index, 'MA20'],
        df.loc[last_index, 'MA10'] > df.loc[last_index, 'MA50'],
        df.loc[last_index, 'RSI'] < 20,
        df.loc[last_index, 'MACD'] > df.loc[last_index, 'Signal'],
        df.loc[last_index, 'close'] < df.loc[last_index, 'lower_BB'],
        df.loc[last_index, 'MFI'] < 20,
        df.loc[last_index, 'volume'] > df.loc[last_index, 'volume_avg']
    ]

    sell_criteria = [
        df.loc[last_index, 'MA10'] < df.loc[last_index, 'MA20'],
        df.loc[last_index, 'MA10'] < df.loc[last_index, 'MA50'],
        df.loc[last_index, 'RSI'] > 80,
        df.loc[last_index, 'MACD'] < df.loc[last_index, 'Signal'],
        df.loc[last_index, 'close'] > df.loc[last_index, 'Upper_BB'],
        df.loc[last_index, 'MFI'] > 80,
        df.loc[last_index, 'volume'] < df.loc[last_index, 'volume_avg']
    ]

    hold_criteria = [
        df.loc[last_index, 'MA10'] == df.loc[last_index, 'MA20'],  # MA10 giao cắt ngang MA20
        df.loc[last_index, 'RSI'] > 30 and df.loc[last_index, 'RSI'] < 70,  # RSI ở mức trung tính
        df.loc[last_index, 'MACD'] == df.loc[last_index, 'Signal'],  # MACD không có chênh lệch
        df.loc[last_index, 'close'] > df.loc[last_index, 'lower_BB'] and df.loc[last_index, 'close'] < df.loc[last_index, 'Upper_BB'],  # Giá nằm trong Bollinger Bands
        df.loc[last_index, 'MFI'] > 30 and df.loc[last_index, 'MFI'] < 70,  # MFI ở mức trung bình
    ]

    buy = sum(buy_criteria)
    sell = sum(sell_criteria)
    hold = sum(hold_criteria)

    if buy > sell and buy > hold:
        signal = "Mua"
    elif sell > buy and sell > hold:
        signal = "Bán"
    elif hold > sell and hold > buy:
        signal = "Nắm giữ"
    else:
        signal = "Chưa có tín hiệu rõ ràng"

    res= {
        "buy": int(buy),
        "hold": int(hold),
        "sell": int(sell),
        "recomendation": signal
    }
    # print(res)
    return res

def caculate_ratio(symbol):
    company= Company(symbol)
    company_ratio= company.ratio_summary()
    
    ratio={}
    ratio['price_to_earning'] = round(float(company_ratio['pe'].iloc[-1]), 2)
    ratio['earnings_per_share'] = round(float(company_ratio['eps'].iloc[-1]), 2)
    ratio['current_ratio'] = round(float(company_ratio['current_ratio'].iloc[-1]), 2)
    ratio['dividend'] = round(float(company_ratio['dividend'].iloc[-1]), 2)
    return ratio    
