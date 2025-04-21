import os

import polars as pl
import yfinance as yf
from vnstock import Vnstock


class DbModel():
    def get_df(self, symbol='vcb', start_date='2020-01-01', end_date='2025-01-01', interval='1D'):
        
        # ****USE DATA FROM EXCEL****
        df = pl.read_csv(f'./app/data/Vietnam/{symbol}.txt', separator='\t')    
        df.columns = ['Date', 'Open', 'Low', 'High', 'Close', 'Volume']
        
        # Shift Close values to Open column
        open_vals = df.select('Close').shift(1)
        df = df.with_column(pl.lit(open_vals).alias('Open'))
        
        columns_to_check = ['Date', 'Open', 'Low', 'High', 'Close', 'Volume']
        
        # Ensure Date column is a datetime object
        df = df.with_columns([
            pl.col('Date').cast(pl.Datetime),
        ])
        
        # Extract date as string without time
        df = df.with_columns([
            pl.col('Date').cast(pl.Datetime).dt.strftime('%Y-%m-%d').alias('Date')
        ])
        
        # ****USE DATA FROM EXCEL****
        
        # ****USE DATA FROM VNSTOCK****
        # stock = Vnstock().stock(symbol=symbol, source="VCI")
        # pandas_df = stock.quote.history(start=start_date, end=end_date, interval=interval)
        # df = pl.from_pandas(pandas_df)
        # df = df.with_columns([
        #     pl.col('time').cast(pl.Datetime),
        # ])
        # df = df.with_columns([
        #     pl.col('time').cast(pl.Datetime).dt.strftime('%Y-%m-%d').alias('Date')
        # ])
        # df = df.drop('time')
        # df = df.rename({
        #     'open': 'Open',
        #     'high': 'High',
        #     'low': 'Low',
        #     'close': 'Close',
        #     'volume': 'Volume'
        # })
        # df = df.with_columns([
        #     pl.col(['Open', 'High', 'Low', 'Close']) * 1000
        # ])
        # ****USE DATA FROM VNSTOCK****
              
        df = df.drop_nulls()
        return df
    
    def get_data_info(self, symbol):
        data_info_list = pl.read_excel('./app/data/Vietnam/Vietnam.xlsx')
        data_info = data_info_list.filter(pl.col('symbol') == symbol + '.HM')
        if data_info.height == 0:
            data_info = data_info_list.filter(pl.col('Symbol') == 'VT:' + symbol.split('.')[0])
        return data_info
    
    def get_all_stock_symbols(self):
        df = pl.read_excel('./app/data/Vietnam/Vietnam.xlsx')    
        
        # Select required columns
        response = df.select(['symbol', 'Name', 'Market', 'Exchange', 'Sector'])
        
        # Add one-based index
        response = response.with_row_count(offset=1)
        
        return response.to_dicts()
        