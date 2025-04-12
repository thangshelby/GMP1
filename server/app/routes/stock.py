from flask import Blueprint,request
from vnstock import Vnstock 
import pandas_ta as ta
from app.utils.stock import analyze_stock_signal
import pandas as pd
import redis
import json
from math import floor
from app.database.model import DbModel
from app.constant.constant import hose
from app.utils.utils import find_near_valid_date

redis_client = redis.Redis(host='localhost', port=6379, db=0)
model= DbModel()

stock_bp = Blueprint('stock_bp', __name__)
@stock_bp.route('/stock_quote', methods=['GET'])
def fetch_stock_prices():
        symbol= request.args.get('symbol') or 'VCB'
        start_date= request.args.get('start_date') or '2000-01-01'
        end_date= request.args.get('end_date') or '2025-01-01'
        interval= request.args.get('interval') or '1D'
        
        
        cache_key= f'stock_quote_{symbol}_{start_date}_{end_date}_{interval}'
    # try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
        
        # GET STOCK DATA FROM API
        stock= Vnstock().stock(symbol=symbol, source="VCI")
        df= stock.quote.history(start=start_date, end=end_date, interval=interval)
        
        df['time'] = pd.to_datetime(df['time'])         
        df.index = df['time']
        df = df.drop(columns=['time'])
        df['date'] = df.index
        df['date']=  df['date'].astype(str)
        df['date']=  df['date'].str.replace(' 00:00:00' ,'')
        df['time'] = df['date']
        df[['open', 'close', 'high','low']]= df[['open', 'close', 'high','low']]*1000
        
        df.dropna(inplace=True)
        
        redis_client.set(cache_key, json.dumps(df.to_dict(orient='records')), ex=60*60*24) 
        
        return df.to_dict(orient='records')
    # except:
        return 'Error'
    

   
@stock_bp.route('/all_stock_rics', methods=['GET'])
def fetch_all_stock_rics():
    df= pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')  
    response = df[['Symbol','Name','Market','Exchange',"Sector"]]  
    response = response.reset_index(drop=True)
    response.index += 1  # Tăng từ 1 thay vì 0
    response = response.to_dict(orient='records')
    
    res=[]
    for item in response:
        current_item={}
        for key,val in item.items():

            current_item[key.lower()]=val
        res.append(current_item)
    return res

@stock_bp.route('/stock_overview_information', methods=['GET'])
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
    
  

@stock_bp.route('/stocks_review', methods=['GET'])
def fetch_stocks():
    end_date= request.args.get('end_date') 
    end_date= find_near_valid_date(end_date)
    quantity= request.args.get('quantity')  
    
    cache_key= f"stocks_review_{end_date}_{quantity}"

    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)  # Trả về dữ liệu cache
    
    stock= Vnstock().stock(symbol='ACB', source='VCI')
    vn30= stock.listing.symbols_by_group('VN30').to_list()
    
    
    res=[]
    for symbol in hose:
        curStock={}
        try:
            company_overview= pd.read_csv(f'./app/data/overview/{symbol}.txt', sep='\t')
            df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
            curStock['industry']= company_overview['industry'].iloc[-1]
            if len(df) > 1:
                signal=None
                try:
                    signal= analyze_stock_signal(df)
                except:
                    signal= 'Không có tín hiệu'
                curStock['signal']= signal 
                curStock['symbol']=symbol
                curStock['last']=round(df['close'].iloc[-1],2)
                curStock['market_cap']= round( company_overview['issue_share'].iloc[-1]*df['close'].iloc[-1],2)
                curStock['volume']=int(df['volume'].iloc[-1])
                curStock['change']=round((df['close'].iloc[-1]-df['close'].iloc[-2])/df['close'].iloc[-2] *100,2)
        
        except:
            continue
            return 'Error'
    
        if(curStock):
            res.append(curStock)
    redis_client.setex(cache_key, 24*60*60*7, json.dumps(res))
    return res
    
    
