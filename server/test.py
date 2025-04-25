# import pandas as pd

# from app.constant.constant import hnx, hose

# icb_2=[]
# icb_3=[]
# icb_4=[]
# industry= []

# for symbol in hnx:
#     try:
#         df= pd.read_csv(f'./app/data/hnx_final_overview/{symbol}.txt', sep='\t')
#         if df['icb_name2'].iloc[-1] not in icb_2:
#             icb_2.append(df['icb_name2'].iloc[-1])
#         if df['icb_name3'].iloc[-1] not in icb_3:
#             icb_3.append(df['icb_name3'].iloc[-1])
#         if df['icb_name4'].iloc[-1] not in icb_4:
#             icb_4.append(df['icb_name4'].iloc[-1])
#         if df['industry'].iloc[-1] not in industry:
#             industry.append(df['industry'].iloc[-1])
#     except:
#         continue
# for symbol in hose:
#     try:
#         df= pd.read_csv(f'./app/data/hose_final_overview/{symbol}.txt', sep='\t')
#         if df['icb_name2'].iloc[-1] not in icb_2:
#             icb_2.append(df['icb_name2'].iloc[-1])
#         if df['icb_name3'].iloc[-1] not in icb_3:
#             icb_3.append(df['icb_name3'].iloc[-1])
#         if df['icb_name4'].iloc[-1] not in icb_4:
#             icb_4.append(df['icb_name4'].iloc[-1])
#         if df['industry'].iloc[-1] not in industry:
#             industry.append(df['industry'].iloc[-1])
#     except:
#         continue

# cnt=0
# for ind in icb_4:
#     if ind not in industry:
#         print(ind)
#         cnt+=1
# print(len(icb_4),len(industry),len(icb_3),len(icb_2))

# import pandas as pd
# from vnstock import Vnstock

# # df = pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
# stock = Vnstock().stock(symbol='AAA', source='VCI')
# df= stock.quote.history(symbol='AAA', start='2022-04-21', end='2023-04-21', interval='1D')
# df = df.dropna()
# # df['formatted_time'] = pd.to_datetime(df['time']).dt.strftime('%Y-%m-%d %H:%M:%S')
# print(df)

import pandas as pd
import pandas_ta as ta

from app.constant.constant import hose
from app.utils.utils import find_near_valid_date

date = find_near_valid_date('2025-04-21')


response = {
    'close_price': {
        'advancing': 0,
        'declining': 0,
    },
    'sma_200': {
        'above': 0,
        'below': 0,
    },
    'sma_50': {
        'above': 0,
        'below': 0,
    },
    'high_low': {
        'new_high': 0,
        'new_low': 0,
    }
}

for symbol in hose[0:]:
    df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')

    # Calculate indicators using pandas_ta
    df['sma_200'] = ta.sma(df['close'], length=200)
    df['sma_50'] = ta.sma(df['close'], length=50)
    df['52w_max'] = df['high'].transform(
        lambda x: x.rolling(252, min_periods=1).max())
    df['52w_min'] = df['low'].transform(
        lambda x: x.rolling(252, min_periods=1).min())

    # Get rows around the date
    target_rows = df[df['time'] == date]
    if not target_rows.empty:
        target_index = target_rows.index[0]
        df_slice = df.iloc[target_index-1:target_index+1]

        last_close = df_slice.iloc[-1]['close']
        previous_close = df_slice.iloc[0]['close']
        last_52w_max = df_slice.iloc[-1]['52w_max']
        last_52w_min = df_slice.iloc[-1]['52w_min']
        last_sma_200 = df_slice.iloc[-1]['sma_200']
        last_sma_50 = df_slice.iloc[-1]['sma_50']

print(response)
