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
    end_date = request.args.get('end_date') or '2024-01-01'
    interval = request.args.get('interval') or '1D'

    cache_key = f'stock_quote_{symbol}_{start_date}_{end_date}_{interval}'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = None
    if interval == '1D':
        try:
            df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
        except:
            try:
                df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
            except:
                return 'Error'
    else:
        stock = Vnstock().stock(symbol='VCB', source='VCI')
        df = stock.quote.history(
            start=start_date, end=end_date, interval=interval)
    df = df.dropna()
    df['time'] = pd.to_datetime(df['time'])
    df = df[df['time'] >= pd.to_datetime(
        start_date)][df['time'] <= pd.to_datetime(end_date)]
    df = convert_timestamp_to_datestring(df)
    df[['close', 'open', 'high', 'low']] = df[[
        'close', 'open', 'high', 'low']] * 1000

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(
        response), ex=60*60*24)

    return response


@stock_bp.route('/stocks_quote', methods=['POST'])
def fetch_stock_overview():
    symbols = request.json.get('symbols')
    symbols = symbols.split(',')
    date = request.json.get('date')
    date = find_near_valid_date(date)
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
        df = convert_timestamp_to_datestring(df)

        df = (df[df['time'] <= date][['close']]*1000).tail(30)
        data = json.loads(redis_client.get(f'stock_review_{symbol}_{date}'))
        data['change'] = data['change_1D']
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


@stock_bp.route('/indicators/sma', methods=['GET'])
def get_SMA():
    symbol = request.args.get('symbol')
    window = request.args.get('window')
    date = request.args.get('date')
    cache_key = f'indicators_sma_{symbol}_{window}_{date}'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = None
    try:
        df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
    except:
        try:
            df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
        except:
            return 'Error'
    # Convert date strings to datetime objects for comparison
    df = df.dropna()
    df['time'] = pd.to_datetime(df['time'])
    df = df[df['time'] <= pd.to_datetime(date)]
    df['sma'] = ta.sma(df['close'], length=int(window))
    df = convert_timestamp_to_datestring(df)
    df.drop(columns=['open', 'high', 'low', 'close', 'volume'], inplace=True)

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response


@stock_bp.route('/indicators/macd', methods=['GET'])
def get_MACD():
    symbol = request.args.get('symbol')
    fast = request.args.get('fast', 12)
    slow = request.args.get('slow', 26)
    signal = request.args.get('signal', 9)
    date = request.args.get('date')
    cache_key = f'indicators_macd_{symbol}_{fast}_{slow}_{signal}_{date}'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = None
    try:
        df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
    except:
        try:
            df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
        except:
            return 'Error'

    df = df.dropna()
    df['time'] = pd.to_datetime(df['time'])
    df = df[df['time'] <= pd.to_datetime(date)]

    # Calculate MACD
    macd = ta.macd(df['close'], fast=int(fast),
                   slow=int(slow), signal=int(signal))
    df['macd'] = macd['MACD_12_26_9']
    df['signal'] = macd['MACDs_12_26_9']
    df['histogram'] = macd['MACDh_12_26_9']

    df = convert_timestamp_to_datestring(df)
    df.drop(columns=['open', 'high', 'low', 'close', 'volume'], inplace=True)

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response


@stock_bp.route('/indicators/bb', methods=['GET'])
def get_BollingerBands():
    symbol = request.args.get('symbol')
    window = request.args.get('window', 20)
    std = request.args.get('std', 2)
    date = request.args.get('date')
    cache_key = f'indicators_bb_{symbol}_{window}_{std}_{date}'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = None
    try:
        df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
    except: 
        try:
            df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
        except:
            return 'Error'

    df = df.dropna()
    df['time'] = pd.to_datetime(df['time'])
    df = df[df['time'] <= pd.to_datetime(date)]

    # Calculate Bollinger Bands
    bb = ta.bbands(df['close'], length=int(window), std=float(std))
    df['bb_upper'] = bb['BBU_20_2.0']
    df['bb_middle'] = bb['BBM_20_2.0']
    df['bb_lower'] = bb['BBL_20_2.0']

    df = convert_timestamp_to_datestring(df)
    df.drop(columns=['open', 'high', 'low', 'close', 'volume'], inplace=True)

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response


@stock_bp.route('/indicators/rsi', methods=['GET'])
def get_RSI():
    symbol = request.args.get('symbol')
    window = request.args.get('window', 14)
    date = request.args.get('date')
    cache_key = f'indicators_rsi_{symbol}_{window}_{date}'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = None
    try:
        df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
    except:
        try:
            df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
        except:
            return 'Error'

    df = df.dropna()
    df['time'] = pd.to_datetime(df['time'])
    df = df[df['time'] <= pd.to_datetime(date)]

    # Calculate RSI
    df['rsi'] = ta.rsi(df['close'], length=int(window))

    df = convert_timestamp_to_datestring(df)
    df.drop(columns=['open', 'high', 'low', 'close', 'volume'], inplace=True)

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response


@stock_bp.route('/indicators/mfi', methods=['GET'])
def get_MFI():
    symbol = request.args.get('symbol')
    window = request.args.get('window', 14)
    date = request.args.get('date')
    cache_key = f'indicators_mfi_{symbol}_{window}_{date}'
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = None
    try:
        df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
    except:
        try:
            df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
        except:
            return 'Error'

    df = df.dropna()
    df['time'] = pd.to_datetime(df['time'])
    df = df[df['time'] <= pd.to_datetime(date)]

    df['mfi'] = ta.mfi(df['high'], df['low'], df['close'],
                       df['volume'], length=int(window))

    df = convert_timestamp_to_datestring(df)
    df.drop(columns=['open', 'high', 'low', 'close', 'volume'], inplace=True)

    response = df.to_dict(orient='records')
    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response
