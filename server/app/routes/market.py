import json
from datetime import datetime, timedelta
from math import floor

import pandas_ta as ta
import polars as pl
import redis
from flask import Blueprint, request
from vnstock import Vnstock

from app.constant.constant import hnx, hose, upcom
from app.database.model import DbModel
from app.utils.stock import analyze_stock_signal
from app.utils.utils import find_near_valid_date

redis_client = redis.Redis(host='localhost', port=6379, db=0)
market_bp = Blueprint('market_bp', __name__)


@market_bp.route('/market_overview', methods=['GET'])
def fetch_market_overview():
    date = request.args.get('date')
    date_before = (datetime.strptime(date, '%Y-%m-%d') -
                   timedelta(days=1)).strftime('%Y-%m-%d')

    cache_key = f"market_overview_{date}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    df = pl.read_csv('./app/data/hose/AAA.txt', separator='\t')
    while date not in df["time"].to_list():
        date = datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
        date = date.strftime('%Y-%m-%d')
    while date_before not in df["time"].to_list():
        date_before = datetime.strptime(
            date_before, '%Y-%m-%d')-timedelta(days=1)
        date_before = date_before.strftime('%Y-%m-%d')

    stock = Vnstock().stock(symbol='AAA', source='VCI')

    def fetch_market(symbol, start, end, interval):
        # Get data from API which returns pandas DataFrame
        df = stock.quote.history(
            symbol=symbol, start=start, end=end, interval=interval)
        # Convert to polars
        df = pl.from_pandas(df)
        df = df.drop_nulls()
        df = df.with_columns([
            pl.col('time').cast(pl.Datetime),
            pl.col('time').cast(pl.Datetime).dt.strftime('%Y-%m-%d %H:%M:%S')
        ])
        return df
    
    hose_market = fetch_market('VNINDEX', date, date, '5m')
    hnx_market = fetch_market('HNXINDEX', date, date, '5m')
    upcom_market = fetch_market('UPCOMINDEX', date, date, '5m')

    def fetch_close(symbol, start, end, interval):
        # Get data from API which returns pandas DataFrame
        df = stock.quote.history(
            symbol=symbol, start=start, end=end, interval=interval)
        # Convert to polars
        df = pl.from_pandas(df)
        df = df.drop_nulls()
        df = df.with_columns([
            pl.col('time').cast(pl.Datetime),
            pl.col('time').cast(pl.Datetime).dt.strftime('%Y-%m-%d %H:%M:%S')
        ])
        return df

    hose_close = fetch_close('VNINDEX', date_before, date_before, '1D').get_column('close')[-1]
    hnx_close = fetch_close('HNXINDEX', date_before, date_before, '1D').get_column('close')[-1]
    upcom_close = fetch_close('UPCOMINDEX', date_before, date_before, '1D').get_column('close')[-1]

    res = {
        'hose_market': hose_market.to_dicts(),
        'hnx_market': hnx_market.to_dicts(),
        'upcom_market': upcom_market.to_dicts(),
        'hose_close': hose_close,
        'hnx_close': hnx_close,
        'upcom_close': upcom_close,
    }

    redis_client.setex(cache_key, 24*60*60*7, json.dumps(res))
    return res


@market_bp.route('/market_indicators_overview', methods=['GET'])
def fetch_market_indicator_overview():
    date = request.args.get('date')
    cache_key = f"market_indicators_overview_{date}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    sample_df = pl.read_csv('./app/data/hose/AAA.txt', separator='\t')
    while date not in sample_df["time"].to_list():
        date = datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
        date = date.strftime('%Y-%m-%d')

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
    
    for symbol in hose:
        try:
            # Read the file with polars
            df = pl.read_csv(f'./app/data/hose/{symbol}.txt', separator='\t')
            
            # Convert to pandas for technical analysis
            pdf = df.to_pandas()
            
            # Calculate indicators using pandas_ta
            pdf['sma_200'] = ta.sma(pdf['close'], length=200)
            pdf['sma_50'] = ta.sma(pdf['close'], length=50)
            pdf['52w_max'] = pdf['high'].transform(
                lambda x: x.rolling(252, min_periods=1).max())
            pdf['52w_min'] = pdf['low'].transform(
                lambda x: x.rolling(252, min_periods=1).min())
                
            # Convert back to polars
            df = pl.from_pandas(pdf)
            
            # Get rows around the date
            target_index = df.filter(pl.col('time') == date).row_nr.item()
            if target_index > 0:
                df_slice = df.slice(target_index-1, 2)
                
                last_close = df_slice.tail(1).get_column('close')[0]
                previous_close = df_slice.head(1).get_column('close')[0]
                last_52w_max = df_slice.tail(1).get_column('52w_max')[0]
                last_52w_min = df_slice.tail(1).get_column('52w_min')[0]
                last_sma_200 = df_slice.tail(1).get_column('sma_200')[0]
                last_sma_50 = df_slice.tail(1).get_column('sma_50')[0]
                
                if last_close >= last_52w_max:
                    response['high_low']['new_high'] += 1
                if last_close <= last_52w_min:
                    response['high_low']['new_low'] += 1

                if last_close > last_sma_200:
                    response['sma_200']['above'] += 1
                else:
                    response['sma_200']['below'] += 1

                if last_close > last_sma_50:
                    response['sma_50']['above'] += 1
                else:
                    response['sma_50']['below'] += 1

                if last_close > previous_close:
                    response['close_price']['advancing'] += 1
                else:
                    response['close_price']['declining'] += 1
        except Exception as e:
            continue

    return response


@market_bp.route('/symbols_review', methods=['GET'])
def fetch_symbols():
    date = request.args.get('date')
    date = find_near_valid_date(date)
    prepare_for = request.args.get('prepare_for')
    is_quote = request.args.get('is_quote')

    cache_key = f"symbols_review_{date}_{prepare_for}_{is_quote}"
    cached_data = redis_client.get(cache_key)

    # if cached_data:
    #     return json.loads(cached_data)

    response = []
    sources = hose+hnx
    stock = Vnstock().stock(symbol='ACB', source='VCI')
    if prepare_for == 'hose':
        sources = stock.listing.symbols_by_group('VN30')
    elif prepare_for == 'hnx':
        sources = stock.listing.symbols_by_group('HNX30')
    for symbol in sources:
        if symbol=='PIA':
            continue
        try:
            cache_key_for_stock = f'stock_review_{symbol}_{date}'
            cached_data = redis_client.get(cache_key_for_stock)
            curStock = json.loads(cached_data)
            if is_quote == 'true':
                try:
                    df = pl.read_csv(f'./app/data/hnx/{symbol}.txt', separator='\t')
                    # Get last 60 columns
                    last_60_rows = df.tail(60)
                    curStock['quote'] = last_60_rows.to_dicts()
                except:
                    try:
                        df = pl.read_csv(f'./app/data/hose/{symbol}.txt', separator='\t')
                        # Get last 60 columns
                        last_60_rows = df.tail(60)
                        curStock['quote'] = last_60_rows.to_dicts()
                    except:
                        continue
        except:
            continue

        if curStock:
            response.append(curStock)
  
    response = sorted(response, key=lambda x: x['market_cap'], reverse=True)
    redis_client.setex(cache_key, 24*60*60*7, json.dumps(response))  
    return response[:500]
