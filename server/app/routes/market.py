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
from app.constant.constant import hose

redis_client = redis.Redis(host='localhost', port=6379, db=0)
market_bp = Blueprint('market_bp', __name__)

    
@market_bp.route('/market_overview', methods=['GET'])
def fetch_market_overview():
    date= request.args.get('date')
    date_before= (datetime.strptime(date, '%Y-%m-%d')-timedelta(days=1)).strftime('%Y-%m-%d')
    
    cache_key= f"market_overview_{date}"
    cached_data = redis_client.get(cache_key)
    # if cached_data:
    #     return json.loads(cached_data)
    
    #test date is valid
    df= pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
    while date not in df['time'].values :
        date= datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
        date= date.strftime('%Y-%m-%d')
    while date_before not in df['time'].values:
        date_before= datetime.strptime(date_before, '%Y-%m-%d')-timedelta(days=1)
        date_before= date_before.strftime('%Y-%m-%d')
        
    
    
    stock= Vnstock().stock(symbol='AAA', source='VCI')
    
    hose_market= stock.quote.history(symbol='VNINDEX', start=date, end=date, interval='5m')
    hose_market.dropna(inplace=True)
    hose_market['time']=pd.to_datetime(hose_market['time'])
    hose_market['time']=hose_market['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    hose_date_before= stock.quote.history(symbol='VNINDEX', start=date_before, end=date_before, interval='1D')
    hose_close= hose_date_before['close'].iloc[-1]
    
    
    hnx_market= stock.quote.history(symbol='HNXINDEX', start=date, end=date, interval='5m')
    hnx_market.dropna(inplace=True)
    hnx_market['time']=pd.to_datetime(hnx_market['time'])
    hnx_market['time']=hnx_market['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    hnx_date_before= stock.quote.history(symbol='HNXINDEX', start='2024-08-30', end=date_before, interval='1D')
    hnx_close= hnx_date_before['close'].iloc[-1]
    
    upcom_market= stock.quote.history(symbol='UPCOMINDEX', start=date, end=date, interval='5m')    
    upcom_market.dropna(inplace=True)
    upcom_market['time']=pd.to_datetime(upcom_market['time'])
    upcom_market['time']=upcom_market['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    upcom_date_before= stock.quote.history(symbol='UPCOMINDEX', start=date_before, end=date_before, interval='1D')
    upcom_close= upcom_date_before['close'].iloc[-1]
    
    res= {
        'hose_market': hose_market.to_dict(orient='records'),
        'hnx_market': hnx_market.to_dict(orient='records'),
        'upcom_market': upcom_market.to_dict(orient='records'),
        'hose_close': hose_close,
        'hnx_close': hnx_close,
        'upcom_close': upcom_close,
    }
    
    redis_client.setex(cache_key, 24*60*60*7,  json.dumps(res))            
    return res
    
@market_bp.route('/market_indicators_overview', methods=['GET'])
def fetch_market_indicator_overview():
    date= request.args.get('date')
    cache_key= f"market_indicators_overview_{date}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    sample_df= pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
    while date not in sample_df['time'].values:
        date= datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
        date= date.strftime('%Y-%m-%d')
    
 
    response={'close_price':{
        'advancing':0,
        'declining':0,
    },'sma_200':{
        'above':0,
        'below':0,
    },'sma_50':{
        'above':0,
        'below':0,
    },'high_low':{
        'new_high':0,
        'new_low':0,
    }}
    for symbol in hose:
        try:
            df= pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
            df['sma_200']= ta.sma(df['close'], length=200)
            df['sma_50']= ta.sma(df['close'], length=50)
            df['52w_max'] = df['high'].transform(lambda x: x.rolling(252, min_periods=1).max())
            df['52w_min'] = df['low'].transform(lambda x: x.rolling(252, min_periods=1).min())
            
            index= df[df['time']==date].index[-1]
            df= df.iloc[index-1:index+1][::]
            
            if df['close'].iloc[-1]>= df['52w_max'].iloc[-1]:
                response['high_low']['new_high']+=1
            if df['close'].iloc[-1]<= df['52w_min'].iloc[-1]:
                response['high_low']['new_low']+=1
                
            
            if df['close'].iloc[-1]> df['sma_200'].iloc[-1]:
                response['sma_200']['above']+=1
            else:
                response['sma_200']['below']+=1
            
            if df['close'].iloc[-1]> df['sma_50'].iloc[-1]:
                response['sma_50']['above']+=1
            else:
                response['sma_50']['below']+=1
                
            if df['close'].iloc[-1]> df['close'].iloc[-2]:
                response['close_price']['advancing']+=1
            else:
                response['close_price']['declining']+=1
        except:
            continue
        
    return response