from flask import Blueprint,request
from vnstock import Vnstock 
import pandas_ta as ta
from app.utils.stock import analyze_stock_signal
import pandas as pd
import redis
import json
from math import floor
from app.database.model import DbModel
from datetime import datetime, timedelta


redis_client = redis.Redis(host='localhost', port=6379, db=0)
market_bp = Blueprint('market_bp', __name__)

   
@market_bp.route('/all_stock_rics', methods=['GET'])
def fetch_all_stock_rics():
    df= pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')  
    response = df[['Symbol','Name','Market','Exchange',"Sector"]]  
    response = response.reset_index(drop=True)
    response.index += 1 
    response = response.to_dict(orient='records')
    
    res=[]
    for item in response:
        current_item={}
        for key,val in item.items():

            current_item[key.lower()]=val
        res.append(current_item)
    return res

@market_bp.route('/stock_overview_information', methods=['GET'])
def fetch_stock_info():
    symbol = request.args.get('symbol')
    cache_key= f'stock_overview_information_{symbol}'
    
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    company = Vnstock().stock(symbol=symbol, source='TCBS').company
    
    company_overview=company.overview()
    res= company_overview.to_dict(orient='records')
  
    redis_client.set(cache_key, json.dumps(res), ex=3600)  
    return company_overview.to_dict(orient='records')

@market_bp.route('/stocks_review', methods=['GET'])
def fetch_stocks():
    end_date= request.args.get('end_date') 
    quantity= request.args.get('quantity')  
    
    cache_key= f"stocks_review_{end_date}_{quantity}"

    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)  # Trả về dữ liệu cache
    
    df= pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')    
    rics= df[['RIC']].values.tolist()
    res=[]
    for ric in rics:
        if len(res)==int(quantity):    
            break
        stock= Vnstock().stock(symbol=ric[0].split('.')[0], source="VCI")
        company = Vnstock().stock(symbol=ric[0].split('.')[0], source='VCI').company
        company_overview=company.overview()

        curStock={}
        curStock['industry']= company_overview['icb_name2'].iloc[-1]
    
        try:
            df = stock.quote.history(start='2024-07-01', end=end_date, interval='1D')
            if len(df) > 1:
                signal=None
                try:
                    signal= analyze_stock_signal(df)
                except:
                    signal= 'Không có tín hiệu'
                curStock['signal']= signal 
                curStock['symbol']=ric[0].split('.')[0]
                curStock['last']=round(df['close'].iloc[-1],2)
                curStock['market_cap']= round( company_overview['issue_share'].iloc[-1]*df['close'].iloc[-1],2)
                curStock['volume']=int(df['volume'].iloc[-1])
                curStock['change']=round((df['close'].iloc[-1]-df['close'].iloc[-2])/df['close'].iloc[-2] *100,2)
        
        except:
            return 'Error'
    
        if(curStock):
            res.append(curStock)
    redis_client.setex(cache_key, 24*60*60*7, json.dumps(res))
    return res
    
@market_bp.route('/market_overview', methods=['GET'])
def fetch_market_overview():
    date= request.args.get('date')
    yesterday= (datetime.strptime(date, '%Y-%m-%d')-timedelta(days=2)).strftime('%Y-%m-%d')
    
    cache_key= f"market_overview_{date}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    def fill_df(date, df):
        # Bước 1: Tạo full time range 15 phút
        full_range = pd.date_range(start=f"{date} 09:00:00", end=f"{date} 16:00:00", freq="5min")

        df.index = pd.to_datetime(df.time)
        df = df.reindex(full_range)

        # Bước 3: Nội suy dữ liệu số
        df = df.interpolate(method="linear")
        df = df.fillna(method='bfill')
        # Bước 4: Tạo lại cột time dạng string
        df['time'] = df.index.strftime('%Y-%m-%d %H:%M:%S')

        # Bước 5: Lọc khung giờ: giữ 9h–12h và 13h–16h
        df = df[(df['time'] <= f'{date} 12:00:00') | (df['time'] >= f'{date} 13:00:00')]

        # Bước 6: Xoá index datetime → reset index
        df.reset_index(drop=True, inplace=True)
    
        return df
       
        
    
    #test date is valid
    df= pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
    if date not in df['time'].values and yesterday not in df['time'].values:
        date= datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
        date= date.strftime('%Y-%m-%d')
        
        yesterday= datetime.strptime(date, '%Y-%m-%d')-timedelta(days=1)
        yesterday= yesterday.strftime('%Y-%m-%d')
    
    stock= Vnstock().stock(symbol='AAA', source='VCI')
    
    hose_market= stock.quote.history(symbol='VNINDEX', start=yesterday, end=date, interval='5m')
    hose_market= fill_df(date,hose_market)
    hnx_market= stock.quote.history(symbol='HNXINDEX', start=yesterday, end=date, interval='5m')
    hnx_market= fill_df(date,hnx_market)
    upcom_market= stock.quote.history(symbol='UPCOMINDEX', start=yesterday, end=date, interval='5m')    
    upcom_market= fill_df(date,upcom_market)
    
    res= {
        'hose_market': hose_market.to_dict(orient='records'),
        'hnx_market': hnx_market.to_dict(orient='records'),
        'upcom_market': upcom_market.to_dict(orient='records')
    }
    
    # redis_client.setex(cache_key, 24*60*60*7, res)            
    return res
    
    