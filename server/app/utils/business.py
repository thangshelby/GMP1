import json
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import pandas_ta as ta
import redis
from vnstock import Vnstock
from vnstock.explorer.vci import Company

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_general_information(company_overview, symbol):
    general_info = {}
    
    # For pandas, we need to get the last row and access columns
    last_row = company_overview.tail(1)
    general_info['issue_share'] = last_row['issue_share'].iloc[0] if 'issue_share' in company_overview.columns else 'N/A'
    general_info['ISIN_code'] = f'VN000000{symbol}0'
    general_info['exchange_code'] = last_row['exchange'].iloc[0]
    general_info['industry'] = last_row['industry'].iloc[0] if 'industry' in company_overview.columns else 'N/A'
    general_info['no._of_employees'] = int(last_row['no_employees'].iloc[0]) if 'no_employees' in company_overview.columns else 'N/A'
   
    return general_info

def get_company_detail(company_overview):
    company_detail = {}
    
    # For pandas, we need to get the last row and access columns
    last_row = company_overview.tail(1)
    company_detail['address'] = 'Viet Nam'
    company_detail['phone_number'] = '028 7308 8888'    
    company_detail['website'] = last_row['website'].iloc[0] if 'website' in company_overview.columns else 'N/A'
    company_detail['company_short_name'] = last_row['short_name'].iloc[0] if 'short_name' in company_overview.columns else 'N/A'
    # company_detail['charter_capital'] = last_row['charter_capital'].iloc[0] if 'charter_capital' in company_overview.columns else 'N/A'
    
    return company_detail

def caculate_share_detail(df, company_overview, start_date, end_date):
    market_data = Vnstock().stock(symbol='VNINDEX', source='VCI')
    market_df = market_data.quote.history(start=start_date, end=end_date, interval="1D")
    
    share_detail = {}
    
    # Get the last close price
    share_detail['close_price'] = df['close'].iloc[-1]
    
    # Filter for 52 week data
    one_year_ago = (datetime.strptime(end_date, '%Y-%m-%d') - timedelta(days=365)).strftime('%Y-%m-%d')
    df_52wk = df[df['time'] >= one_year_ago]
    
    share_detail['52_wk_high'] = df_52wk['high'].max() if not df_52wk.empty else np.nan
    share_detail['52_wk_low'] = df_52wk['low'].min() if not df_52wk.empty else np.nan
    
    # Calculate moving averages for volume
    vol_5d = df['volume'].rolling(window=5).mean().iloc[-1]
    vol_10d = df['volume'].rolling(window=10).mean().iloc[-1]
    
    share_detail['5_day_average_volume'] = vol_5d
    share_detail['10_day_average_volume'] = vol_10d
    share_detail['currency'] = 'VND'
    
    # Prepare data for beta calculation
    df_for_merge = df[['time', 'close']].rename(columns={'close': 'Stock'})
    market_df_for_merge = market_df[['time', 'close']].rename(columns={'close': 'Market'})
    
    # Join the dataframes
    merge_df = pd.merge(df_for_merge, market_df_for_merge, on='time', how='inner')
    
    # Calculate returns
    merge_df['Stock Return'] = np.log(merge_df['Stock'] / merge_df['Stock'].shift(1))
    merge_df['Market Return'] = np.log(merge_df['Market'] / merge_df['Market'].shift(1))
    merge_df = merge_df.dropna()
    
    # Calculate beta
    cov_matrix = merge_df[['Stock Return', 'Market Return']].cov()
    share_detail['beta_value'] = cov_matrix.loc['Stock Return', 'Market Return'] / merge_df['Market Return'].var()
    
    # Get outstanding shares
    share_detail['outstanding_share'] = company_overview['outstanding_share'].iloc[-1] if 'outstanding_share' in company_overview.columns else 'N/A'
    
    return share_detail
    
def caculate_percentage_change(df, date):
    date_dt = datetime.strptime(date, '%Y-%m-%d')
    percentage_change = {}
    
    # Helper function to calculate percentage change
    def calc_pct_change(days):
        if len(df) < days:
            return np.nan
        latest_close = df['close'].iloc[-1]
        earlier_close = df['close'].iloc[-days]
        return round(((latest_close - earlier_close) / earlier_close) * 100, 2)
    
    # Calculate various time-period changes
    percent_change = {
        "1_day": calc_pct_change(1),
        "5_day": calc_pct_change(5),
        "3_months": calc_pct_change(63),
        "6_months": calc_pct_change(126),
        "month_to_date": calc_pct_change(len(df[df['time'].dt.month == date_dt.month])),
        "year_to_date": calc_pct_change(len(df[df['time'].dt.year == date_dt.year])),
    }
    
    return percent_change
    
def caculte_analyst_outlook(df):
    pandas_df = df if isinstance(df, pd.DataFrame) else pd.DataFrame(df)
    
    # Calculate technical indicators
    pandas_df['MA10'] = pandas_df['close'].rolling(window=10).mean()
    pandas_df['MA20'] = pandas_df['close'].rolling(window=20).mean()
    pandas_df['MA50'] = pandas_df['close'].rolling(window=50).mean()

    # Calculate Bollinger Bands
    middle_bb = pandas_df['close'].rolling(window=20).mean().iloc[-1]
    std_dev = pandas_df['close'].rolling(window=20).std().iloc[-1]
    pandas_df['Middle_BB'] = middle_bb
    pandas_df['Upper_BB'] = middle_bb + 2 * std_dev
    pandas_df['lower_BB'] = middle_bb - 2 * std_dev

    # Calculate RSI
    pandas_df['RSI'] = ta.rsi(close=pandas_df['close'], length=14)

    # Calculate MACD
    pandas_df['MACD'] = pandas_df['close'].ewm(span=12, adjust=False).mean() - pandas_df['close'].ewm(span=26, adjust=False).mean()
    pandas_df['Signal'] = pandas_df['MACD'].ewm(span=9, adjust=False).mean()

    # Calculate MFI
    # 1. Typical Price
    pandas_df['Typical_Price'] = (pandas_df['high'] + pandas_df['low'] + pandas_df['close']) / 3

    # 2. Raw Money Flow
    pandas_df['Raw_Money_Flow'] = pandas_df['Typical_Price'] * pandas_df['volume']

    # 3. Money Flow Positive/Negative
    pandas_df['Positive_Flow'] = pandas_df['Raw_Money_Flow'].where(pandas_df['Typical_Price'] > pandas_df['Typical_Price'].shift(1), 0)
    pandas_df['Negative_Flow'] = pandas_df['Raw_Money_Flow'].where(pandas_df['Typical_Price'] < pandas_df['Typical_Price'].shift(1), 0)

    # 4. Rolling Sum for 14 periods
    pandas_df['Positive_Flow_Sum'] = pandas_df['Positive_Flow'].rolling(window=14).sum()
    pandas_df['Negative_Flow_Sum'] = pandas_df['Negative_Flow'].rolling(window=14).sum()

    # 5. Money Flow Ratio
    pandas_df['Money_Flow_Ratio'] = pandas_df['Positive_Flow_Sum'] / pandas_df['Negative_Flow_Sum']

    # 6. MFI Calculation
    pandas_df['MFI'] = 100 - (100 / (1 + pandas_df['Money_Flow_Ratio']))

    # Volume average
    pandas_df['volume_avg'] = pandas_df['volume'].rolling(window=20).mean()

    # Get the last index for analysis
    last_index = pandas_df.index[-1]

    # Trading signals criteria
    buy_criteria = [
        pandas_df.loc[last_index, 'MA10'] > pandas_df.loc[last_index, 'MA20'],
        pandas_df.loc[last_index, 'MA10'] > pandas_df.loc[last_index, 'MA50'],
        pandas_df.loc[last_index, 'RSI'] < 20,
        pandas_df.loc[last_index, 'MACD'] > pandas_df.loc[last_index, 'Signal'],
        pandas_df.loc[last_index, 'close'] < pandas_df.loc[last_index, 'lower_BB'],
        pandas_df.loc[last_index, 'MFI'] < 20,
        pandas_df.loc[last_index, 'volume'] > pandas_df.loc[last_index, 'volume_avg']
    ]

    sell_criteria = [
        pandas_df.loc[last_index, 'MA10'] < pandas_df.loc[last_index, 'MA20'],
        pandas_df.loc[last_index, 'MA10'] < pandas_df.loc[last_index, 'MA50'],
        pandas_df.loc[last_index, 'RSI'] > 80,
        pandas_df.loc[last_index, 'MACD'] < pandas_df.loc[last_index, 'Signal'],
        pandas_df.loc[last_index, 'close'] > pandas_df.loc[last_index, 'Upper_BB'],
        pandas_df.loc[last_index, 'MFI'] > 80,
        pandas_df.loc[last_index, 'volume'] < pandas_df.loc[last_index, 'volume_avg']
    ]

    hold_criteria = [
        pandas_df.loc[last_index, 'MA10'] == pandas_df.loc[last_index, 'MA20'],  # MA10 crosses MA20
        pandas_df.loc[last_index, 'RSI'] > 30 and pandas_df.loc[last_index, 'RSI'] < 70,  # RSI in neutral zone
        pandas_df.loc[last_index, 'MACD'] == pandas_df.loc[last_index, 'Signal'],  # MACD has no divergence
        pandas_df.loc[last_index, 'close'] > pandas_df.loc[last_index, 'lower_BB'] and pandas_df.loc[last_index, 'close'] < pandas_df.loc[last_index, 'Upper_BB'],  # Price within Bollinger Bands
        pandas_df.loc[last_index, 'MFI'] > 30 and pandas_df.loc[last_index, 'MFI'] < 70,  # MFI in average range
    ]

    buy = sum(buy_criteria)
    sell = sum(sell_criteria)
    hold = sum(hold_criteria)

    # Determine recommendation
    if buy > sell and buy > hold:
        signal = "Mua"
    elif sell > buy and sell > hold:
        signal = "Bán"
    elif hold > sell and hold > buy:
        signal = "Nắm giữ"
    else:
        signal = "Chưa có tín hiệu rõ ràng"

    res = {
        "buy": int(buy),
        "hold": int(hold),
        "sell": int(sell),
        "recomendation": signal
    }
    
    return res

def caculate_ratio(symbol):
    company = Company(symbol)
    company_ratio = company.ratio_summary()
    
    # Get the last row
    last_row = company_ratio.tail(1)
    
    ratio = {}
    ratio['price_to_earning'] = round(float(last_row['pe'].iloc[0]), 2)
    ratio['earnings_per_share'] = round(float(last_row['eps'].iloc[0]), 2)
    ratio['current_ratio'] = round(float(last_row['current_ratio'].iloc[0]), 2)
    ratio['dividend'] = round(float(last_row['dividend'].iloc[0]), 2)
    
    return ratio    
