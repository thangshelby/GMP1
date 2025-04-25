import json
from math import floor

import pandas as pd
import pandas_ta as ta
import redis
from flask import Blueprint, request
from vnstock import Vnstock

from app.constant.constant import hose
from app.utils.utils import convert_timestamp_to_datestring, find_near_valid_date

redis_client = redis.Redis(host='localhost', port=6379, db=0)


stock_bp = Blueprint('stock_bp', __name__)


@stock_bp.route('/stock_quote', methods=['GET'])
def fetch_stock_prices():
    symbol = request.args.get('symbol') or 'VCB'
    start_date = request.args.get('start_date') or '2000-01-01'
    end_date = request.args.get('end_date') or '2025-01-01'
    interval = request.args.get('interval') or '1D'

    cache_key = f'stock_quote_{symbol}_{start_date}_{end_date}_{interval}'
    cached_data = redis_client.get(cache_key)
    # if cached_data:
    #     return json.loads(cached_data)

    try:
        df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')    
    except:
        try:
            df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
        except:
            return 'Error'
    df = df.dropna()
    df= convert_timestamp_to_datestring(df)
    df= df[df['time'] >= start_date][df['time'] <= end_date]    
    df[['close', 'open', 'high', 'low']] = df[['close', 'open', 'high', 'low']] * 1000

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(
        response), ex=60*60*24)

    return response



@stock_bp.route('/stocks_quote', methods=['GET'])
def fetch_stock_overview():
    symbols = request.args.get('symbols')
    symbols = symbols.split(',')
    date = request.args.get('date')
    date= find_near_valid_date(date)
    response = []

    cache_key = f'stocks_quote_{symbols}_{date}_'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    for symbol in symbols:
        df = None
        try:
            df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
        except:
            try:
                df = pd.read_csv(
                    f'./app/data/hnx/{symbol}.txt', sep='\t')
            except:
                continue
        df.dropna(subset=['close'])
        df= convert_timestamp_to_datestring(df)

        df = (df[df['time'] <= date][['close']]*1000).tail(30)
        data = json.loads(redis_client.get(f'stock_review_{symbol}_{date}'))

        response.append(
            {'data': data, 'quote': df['close'].tolist()})

    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response


@stock_bp.route('/all_stock_symbols', methods=['GET'])
def fetch_all_stock_rics():
    df = pd.read_excel('./app/data/Vietnam/Vietnam.xlsx')   
    response = df[['Symbol', 'Name', 'Market', 'Exchange', 'Sector']]
    response = response.reset_index(drop=True)
    response.index += 1  # Adjust to start from 1
    response = response.to_dict(orient='records')

    res = []
    for item in response:
        current_item = {}
        for key, val in item.items():
            if key != 'row_nr':
                current_item[key.lower()] = val
        res.append(current_item)
    return res


@stock_bp.route('/stock_review', methods=['GET'])
def fetch_stock_info():
    symbol = request.args.get('symbol')
    date = request.args.get('date')
    cache_key = f'stock_review_{symbol}_{date}'

    response = redis_client.get(cache_key)

    if response:
        return json.loads(response)
