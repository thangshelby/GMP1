import json
from datetime import datetime, timedelta
from math import floor

import pandas as pd
import pandas_ta as ta
import redis
from flask import Blueprint, request
from vnstock import Vnstock

from app.constant.constant import hnx, hose, upcom
from app.database.model import DbModel
from app.utils.stock import analyze_stock_signal
from app.utils.utils import find_near_valid_date

redis_client = redis.Redis(host='localhost', port=6379, db=0)
screener_bp = Blueprint('screener_bp', __name__)
# 

@screener_bp.route('/', methods=['GET'])
def fetch_symbols():
    date= request.args.get('date') 
    date= find_near_valid_date(date)
    page= request.args.get('page')
    start= (int(page)-1)*20
    end= start+20
    
    cache_key= f'screener_{date}_{page}'

    cached_data = redis_client.get(cache_key)   
    # if cached_data:
    #     return json.loads(cached_data) 
    
    sources= hose+hnx
    
    response={'data':[]}
    response['total_count']= len(sources)
    for symbol in sources[start:end]:
        cache_key_for_stock= f'stock_review_{symbol}_{date}'
        cached_data= redis_client.get(cache_key_for_stock)
        tempRes= json.loads(cached_data)
        tempRes['change']= tempRes['change_1D']
        response['data'].append(tempRes)
    redis_client.setex(cache_key, 24*60*60*7, json.dumps(response))
    return response
    