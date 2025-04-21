import pandas as pd

from app.constant.constant import hnx, hose

icb_2=[]
icb_3=[]
icb_4=[]
industry= []

for symbol in hnx:
    try:
        df= pd.read_csv(f'./app/data/hnx_final_overview/{symbol}.txt', sep='\t')
        if df['icb_name2'].iloc[-1] not in icb_2:
            icb_2.append(df['icb_name2'].iloc[-1])
        if df['icb_name3'].iloc[-1] not in icb_3:
            icb_3.append(df['icb_name3'].iloc[-1])
        if df['icb_name4'].iloc[-1] not in icb_4:
            icb_4.append(df['icb_name4'].iloc[-1])
        if df['industry'].iloc[-1] not in industry:
            industry.append(df['industry'].iloc[-1])
    except:
        continue
for symbol in hose:
    try:
        df= pd.read_csv(f'./app/data/hose_final_overview/{symbol}.txt', sep='\t')
        if df['icb_name2'].iloc[-1] not in icb_2:
            icb_2.append(df['icb_name2'].iloc[-1])
        if df['icb_name3'].iloc[-1] not in icb_3:
            icb_3.append(df['icb_name3'].iloc[-1])
        if df['icb_name4'].iloc[-1] not in icb_4:
            icb_4.append(df['icb_name4'].iloc[-1])
        if df['industry'].iloc[-1] not in industry:
            industry.append(df['industry'].iloc[-1])
    except:
        continue

cnt=0
for ind in icb_4:
    if ind not in industry:
        print(ind)
        cnt+=1
print(len(icb_4),len(industry),len(icb_3),len(icb_2))



