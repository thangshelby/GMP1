import json
from datetime import datetime, timedelta

import numpy as np
import pandas_ta as ta
import polars as pl
import redis
from vnstock import Vnstock
from vnstock.explorer.vci import Company

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_general_information(company_overview, symbol):
    general_info = {}
    
    # For polars, we need to get the last row and access columns
    last_row = company_overview.tail(1)
    general_info['issue_share'] = last_row.get_column('issue_share')[0] if 'issue_share' in company_overview.columns else 'N/A'
    general_info['ISIN_code'] = f'VN000000{symbol}0'
    general_info['exchange_code'] = last_row.get_column('exchange')[0]
    general_info['industry'] = last_row.get_column('industry')[0] if 'industry' in company_overview.columns else 'N/A'
    general_info['no._of_employees'] = int(last_row.get_column('no_employees')[0]) if 'no_employees' in company_overview.columns else 'N/A'
   
    return general_info

def get_company_detail(company_overview):
    company_detail = {}
    
    # For polars, we need to get the last row and access columns
    last_row = company_overview.tail(1)
    company_detail['address'] = 'Viet Nam'
    company_detail['phone_number'] = '028 7308 8888'    
    company_detail['website'] = last_row.get_column('website')[0] if 'website' in company_overview.columns else 'N/A'
    company_detail['company_short_name'] = last_row.get_column('short_name')[0] if 'short_name' in company_overview.columns else 'N/A'
    # company_detail['charter_capital'] = last_row.get_column('charter_capital')[0] if 'charter_capital' in company_overview.columns else 'N/A'
    
    return company_detail

def caculate_share_detail(df, company_overview, start_date, end_date):
    market_data = Vnstock().stock(symbol='VNINDEX', source='VCI')
    market_pandas_df = market_data.quote.history(start=start_date, end=end_date, interval="1D")
    market_df = pl.from_pandas(market_pandas_df)
    
    share_detail = {}
    
    # Get the last close price
    share_detail['close_price'] = df.select(pl.col('close')).tail(1).item()
    
    # Filter for 52 week data
    one_year_ago = (datetime.strptime(end_date, '%Y-%m-%d') - timedelta(days=365)).strftime('%Y-%m-%d')
    df_52wk = df.filter(pl.col('time') >= one_year_ago)
    
    share_detail['52_wk_high'] = df_52wk.select(pl.col('high').max()).item() if df_52wk.height > 0 else np.nan
    share_detail['52_wk_low'] = df_52wk.select(pl.col('low').min()).item() if df_52wk.height > 0 else np.nan
    
    # Calculate moving averages for volume
    vol_5d = df.select(pl.col('volume').rolling_mean(window_size=5)).tail(1).item()
    vol_10d = df.select(pl.col('volume').rolling_mean(window_size=10)).tail(1).item()
    
    share_detail['5_day_average_volume'] = vol_5d
    share_detail['10_day_average_volume'] = vol_10d
    share_detail['currency'] = 'VND'
    
    # Prepare data for beta calculation
    df_for_merge = df.select(['time', 'close']).rename({'close': 'Stock'})
    market_df_for_merge = market_df.select(['time', 'close']).rename({'close': 'Market'})
    
    # Join the dataframes
    merge_df = df_for_merge.join(market_df_for_merge, on='time', how='inner')
    
    # Calculate returns - need to convert to pandas for this complex calculation
    pd_merge_df = merge_df.to_pandas()
    pd_merge_df['Stock Return'] = np.log(pd_merge_df['Stock'] / pd_merge_df['Stock'].shift(1))
    pd_merge_df['Market Return'] = np.log(pd_merge_df['Market'] / pd_merge_df['Market'].shift(1))
    pd_merge_df = pd_merge_df.dropna()
    
    # Calculate beta
    cov_matrix = pd_merge_df[['Stock Return', 'Market Return']].cov()
    share_detail['beta_value'] = cov_matrix.loc['Stock Return', 'Market Return'] / pd_merge_df['Market Return'].var()
    
    # Get outstanding shares
    share_detail['outstanding_share'] = company_overview.select(pl.col('outstanding_share')).tail(1).item()
    
    return share_detail
    
def caculate_percentage_change(df, date):
    date_dt = datetime.strptime(date, '%Y-%m-%d')
    percentage_change = {}
    
    # Helper function to calculate percentage change
    def calc_pct_change(days):
        if df.height < days:
            return np.nan
        latest_close = df.select(pl.col('close')).tail(1).item()
        earlier_close = df.select(pl.col('close')).tail(days).head(1).item()
        return round(((latest_close - earlier_close) / earlier_close) * 100, 2)
    
    # Calculate various time-period changes
    percent_change = {
        "1_day": calc_pct_change(1),
        "5_day": calc_pct_change(5),
        "3_months": calc_pct_change(63),
        "6_months": calc_pct_change(126),
        "month_to_date": calc_pct_change(df.filter(pl.col('time').dt.month() == date_dt.month).height),
        "year_to_date": calc_pct_change(df.filter(pl.col('time').dt.year() == date_dt.year).height),
    }
    
    return percent_change
    
def caculte_analyst_outlook(df):
    # Convert to pandas for technical analysis
    pandas_df = df.to_pandas()
    
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
    
    # Convert to polars for consistency
    ratio_df = pl.from_pandas(company_ratio)
    last_row = ratio_df.tail(1)
    
    ratio = {}
    ratio['price_to_earning'] = round(float(last_row.get_column('pe')[0]), 2)
    ratio['earnings_per_share'] = round(float(last_row.get_column('eps')[0]), 2)
    ratio['current_ratio'] = round(float(last_row.get_column('current_ratio')[0]), 2)
    ratio['dividend'] = round(float(last_row.get_column('dividend')[0]), 2)
    
    return ratio    
