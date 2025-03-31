import pandas as pd
import os
import yfinance as yf
from vnstock import Vnstock
class DbModel():
    def get_df(self, symbol='vcb',start_date='2020-01-01',end_date='2025-01-01',interval='1D'):
        
        # ****USE DATA FROM EXCEL****
        df= pd.read_csv(f'./app/data/Vietnam/{symbol}.txt',sep='\t')    
        df.columns =['Date', 'Open', 'Low', 'High', 'Close', 'Volume']
        df.loc[1:, "Open"] = df["Close"].shift(1)[1:]
        
        columns_to_check = [ 'Date', 'Open', 'Low', 'High', 'Close', 'Volume']
        # Ensure Date column is a datetime object
        
        df['Date'] = pd.to_datetime(df['Date'])
        df.index = df['Date']

        # # Set Date as the index
        df['Date'] = df.index
        df['Date']=  df['Date'].astype(str)
        df['Date']=  df['Date'].str.replace(' 00:00:00','')  
        # ****USE DATA FROM EXCEL****
        
        
        # ****USE DATA FROM VNSTOCK****
        # stock = Vnstock().stock(symbol=symbol, source="VCI")
        # df = stock.quote.history(start=start_date, end=end_date, interval=interval)
        # df["time"] = pd.to_datetime(df["time"])
        # df.index = df["time"]
        # df = df.drop(columns=['time'])
        # df['Date'] = df.index
        # df['Date']=  df['Date'].astype(str)
        # df['Date']=  df['Date'].str.replace(' 00:00:00','')  
        # df.columns = ['Open','High','Low','Close','Volume','Date']
        # df[['Open', 'High', 'Low', 'Close']] = df[['Open', 'High', 'Low', 'Close']] * 1000
        # ****USE DATA FROM VNSTOCK****
              
        df.dropna(inplace=True)
        return df
    def get_data_info(self, symbol):
        data_info_list= pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')
        data_info = data_info_list[data_info_list['symbol']==symbol+'.HM'] 
        if data_info.empty:
            data_info = data_info_list[data_info_list['Symbol']=='VT:'+ symbol.split('.')[0]]
        return data_info
    def get_all_stock_symbols(self):
        df= pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')    
        
        # print(df.columns)
        response = df[['symbol','Name','Market','Exchange',"Sector"]]
        response = response.reset_index(drop=True)
        response.index += 1  # Tăng từ 1 thay vì 0

        return response.to_dict(orient='records')
        