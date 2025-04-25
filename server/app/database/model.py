import os

import pandas as pd
import yfinance as yf
from vnstock import Vnstock


class DbModel():
    def get_df(self, symbol='vcb', start_date='2020-01-01', end_date='2025-01-01', interval='1D'):
        
        # ****USE DATA FROM EXCEL****
        df = pd.read_csv(f'./app/data/Vietnam/{symbol}.txt', sep='\t')    
        df.columns = ['Date', 'Open', 'Low', 'High', 'Close', 'Volume']
        
        # Shift Close values to Open column
        df['Open'] = df['Close'].shift(1)
        
        columns_to_check = ['Date', 'Open', 'Low', 'High', 'Close', 'Volume']
        
        # Ensure Date column is a datetime object
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Extract date as string without time
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
        # ****USE DATA FROM EXCEL****
        
        # ****USE DATA FROM VNSTOCK****
        # stock = Vnstock().stock(symbol=symbol, source="VCI")
        # df = stock.quote.history(start=start_date, end=end_date, interval=interval)
        # df['Date'] = pd.to_datetime(df['time']).dt.strftime('%Y-%m-%d')
        # df = df.drop('time', axis=1)
        # df = df.rename(columns={
        #     'open': 'Open',
        #     'high': 'High',
        #     'low': 'Low',
        #     'close': 'Close',
        #     'volume': 'Volume'
        # })
        # df[['Open', 'High', 'Low', 'Close']] = df[['Open', 'High', 'Low', 'Close']] * 1000
        # ****USE DATA FROM VNSTOCK****
              
        df = df.dropna()
        return df
    
    def get_data_info(self, symbol):
        data_info_list = pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')
        data_info = data_info_list[data_info_list['symbol'] == symbol + '.HM']
        if len(data_info) == 0:
            data_info = data_info_list[data_info_list['Symbol'] == 'VT:' + symbol.split('.')[0]]
        return data_info
    
    def get_all_stock_symbols(self):
        df = pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')    
        
        # Select required columns
        response = df[['symbol', 'Name', 'Market', 'Exchange', 'Sector']]
        
        # Add one-based index
        response = response.reset_index(drop=True)
        response.index += 1  # Adjust to start from 1
        
        return response.to_dict(orient='records')
        