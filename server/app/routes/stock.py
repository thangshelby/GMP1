import json
from math import floor

import pandas_ta as ta
import polars as pl
import redis
from flask import Blueprint, request
from vnstock import Vnstock

from app.constant.constant import hose
from app.utils.utils import find_near_valid_date

redis_client = redis.Redis(host='localhost', port=6379, db=0)


stock_bp = Blueprint('stock_bp', __name__)


@stock_bp.route('/stock_quote', methods=['GET'])
def fetch_stock_prices():
    symbol = request.args.get('symbol') or 'VCB'
    start_date = request.args.get('start_date') or '2000-01-01'
    end_date = request.args.get('end_date') or '2025-01-01'
    interval = request.args.get('interval') or '1D'

    cache_key = f'stock_quote_{symbol}_{start_date}_{end_date}_{interval}'
# try:
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    # GET STOCK DATA FROM API
    stock = Vnstock().stock(symbol=symbol, source="VCI")
    df = stock.quote.history(start=start_date, end=end_date, interval=interval)

    # Convert pandas to polars
    df = pl.from_pandas(df)

    df = df.with_columns([
        pl.col('time').cast(pl.Datetime),
        pl.col('time').alias('date').cast(str).str.replace(' 00:00:00', ''),
        pl.col('open') * 1000,
        pl.col('close') * 1000,
        pl.col('high') * 1000,
        pl.col('low') * 1000
    ])

    df = df.drop_nulls()

    redis_client.set(cache_key, json.dumps(
        df.to_dicts()), ex=60*60*24)

    return df.to_dicts()
# except:
    return 'Error'


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
            df = pl.read_csv(f'./app/data/hose/{symbol}.txt', separator='\t')
        except:
            try:
                df = pl.read_csv(
                    f'./app/data/hnx/{symbol}.txt', separator='\t')
            except:
                continue
        df.drop_nulls(subset=['close'])

        df = df.filter(pl.col('time') <= date).select(['close']).tail(30)
        data = json.loads(redis_client.get(f'stock_review_{symbol}_{date}'))

        response.append(
            {'data': data, 'quote': df['close'].to_list()})

    redis_client.set(cache_key, json.dumps(response), ex=60*60*24)
    return response


@stock_bp.route('/all_stock_rics', methods=['GET'])
def fetch_all_stock_rics():
    df = pl.read_excel('./app/data/Vietnam/Vietnam.xlsx')
    response = df.select(['Symbol', 'Name', 'Market', 'Exchange', 'Sector'])
    response = response.with_row_count(offset=1)
    response = response.to_dicts()

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
