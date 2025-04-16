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
from app.constant.constant import hose,hnx,upcom
from app.utils.utils import find_near_valid_date

redis_client = redis.Redis(host='localhost', port=6379, db=0)
screener_bp = Blueprint('screener_bp', __name__)


@screener_bp.route('/', methods=['GET'])
def fetch_symbols():
    end_date= request.args.get('end_date') 
    end_date= find_near_valid_date(end_date)
    page= request.args.get('page')
    start= (int(page)-1)*20
    end= start+20
    
    
    cache_key= f"symbols_{end_date}_{page}"

    cached_data = redis_client.get(cache_key)   
    if cached_data:
        return json.loads(cached_data)  # Trả về dữ liệu cache
    
    sources= hose+hnx+upcom
    
    res={'data':[]}
    res['total_count']= len(sources)
    print(res)
    for symbol in sources[start:end]:
        curStock={}
        try:
            company_overview= pd.read_csv(f'./app/data/overview/{symbol}.txt', sep='\t')
            df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
            curStock['quote']= df.iloc[:,0:100].to_dict(orient='records')
            curStock['industry']= company_overview['industry'].iloc[-1]
            curStock['name']= company_overview['short_name'].iloc[-1]
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
            res['data'].append(curStock)
    redis_client.setex(cache_key, 24*60*60*7, json.dumps(res))
    return res
    