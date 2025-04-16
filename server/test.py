import pandas as pd
from app.constant.constant import hose
from vnstock import Vnstock

stock= Vnstock().stock(symbol='AAA', source='VCI')
df= stock.listing.symbols_by_group('UPCOM')
print(df.to_list())