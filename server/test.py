# import pandas as pd
# from vnstock import Vnstock

# # Khởi tạo đối tượng Vnstock và lấy danh sách công ty từ nhóm HOSE
# vnstock = Vnstock()
# companies = vnstock.stock(symbol='ACB', source='TCBS').listing.symbols_by_group('HOSE').to_list()

# overview_list = []

# # Giới hạn chỉ lấy 10 công ty để tránh quá tải trong lần chạy đầu tiên (có thể mở rộng sau)
# for symbol in companies[400:413]:
#     try:
#         stock = vnstock.stock(symbol=symbol, source='TCBS')
#         company = stock.company
#         overview_data = company.overview()
#         # print(overview_data)
#         overview_data.to_csv(f"./app/data/overview/{symbol}.txt",sep='\t' ,index=False)
#     except Exception as e:
#         print(f"Không lấy được dữ liệu công ty {symbol}: {e}")

import pandas as pd
# import polars as pl
# from datetime import datetime, timedelta
# from app.constant.constant import hose

# date='2024-04-10'
# df= pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
# if date not in df['time'].values:
#     date= datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
#     date= date.strftime('%Y-%m-%d')
    
# response ={}
# symbols={}
# for symbol in hose[0:]:
#         df= pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
#         df= df[df['time']==date ][['time','close']]
        
#         symbols[symbol]= df['close'].values[0]
# print(symbols)

from vnstock import Vnstock
date='2024-01-02'
stock = Vnstock().stock(symbol='ACB', source='VCI')

hose_market= stock.quote.history(symbol='VNINDEX', start='2024-09-03', end='2024-09-04', interval='15m')

full_range = pd.date_range(start="2024-09-04 09:00:00", end="2024-09-04 16:00:00", freq="15min")

hose_market.index= pd.to_datetime(hose_market.time)
df_full = hose_market.reindex(full_range)
df_full_filled = df_full.interpolate(method="linear")
print(df_full_filled)

# hnx_market= stock.quote.history(symbol='HNXINDEX', start='2024-09-03', end='2024-09-04', interval='1H')
# upcom_market= stock.quote.history(symbol='UPCOMINDEX', start='2024-09-03', end='2024-09-04', interval='1H')

# print(hose_market,hnx_market,upcom_market)