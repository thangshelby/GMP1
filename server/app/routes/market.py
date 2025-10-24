import json
from datetime import datetime, timedelta
import pandas as pd
import pandas_ta as ta
import redis
from flask import Blueprint, request
from vnstock import Vnstock
from app.constant.constant import hnx, hose, upcom
from app.utils.utils import convert_timestamp_to_datestring, find_near_valid_date

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

    df = pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
    date = find_near_valid_date(date)
    date_before = find_near_valid_date(date_before)

    stock = Vnstock().stock(symbol='AAA', source='VCI')

    def fetch_market(symbol, start, end, interval):
        df = stock.quote.history(
            symbol=symbol, start=start, end=end, interval=interval)
        df = df.dropna()
        df = convert_timestamp_to_datestring(df, '%Y-%m-%d-%H-%M')
        return df

    hose_market = fetch_market('VNINDEX', date, date, '5m')
    hnx_market = fetch_market('HNXINDEX', date, date, '5m')
    upcom_market = fetch_market('UPCOMINDEX', date, date, '5m')

    def fetch_close(symbol, start, end, interval):
        df = stock.quote.history(
            symbol=symbol, start=start, end=end, interval=interval)
        df = df.dropna()
        return df

    hose_close = fetch_close('VNINDEX', date_before,
                             date_before, '1D')['close'].iloc[-1]
    hnx_close = fetch_close('HNXINDEX', date_before,
                            date_before, '1D')['close'].iloc[-1]
    upcom_close = fetch_close(
        'UPCOMINDEX', date_before, date_before, '1D')['close'].iloc[-1]

    res = {
        'hose_market': hose_market.to_dict(orient='records'),
        'hnx_market': hnx_market.to_dict(orient='records'),
        'upcom_market': upcom_market.to_dict(orient='records'),
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

    date = find_near_valid_date(date)

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

    for symbol in hose+hnx:
        try:
            # Read the file with pandas
            df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')

            # Calculate indicators using pandas_ta
            df['sma_200'] = ta.sma(df['close'], length=200)
            df['sma_50'] = ta.sma(df['close'], length=50)
            df['52w_max'] = df['high'].transform(
                lambda x: x.rolling(252, min_periods=1).max())
            df['52w_min'] = df['low'].transform(
                lambda x: x.rolling(252, min_periods=1).min())

            # Get rows around the date
            target_index = df[df['time'] == date].index[0] if not df[df['time'] == date].empty else -1
            if target_index > 0:
                df_slice = df.iloc[target_index-1:target_index+1]

                last_close = df_slice.iloc[-1]['close']
                previous_close = df_slice.iloc[0]['close']
                last_52w_max = df_slice.iloc[-1]['52w_max']
                last_52w_min = df_slice.iloc[-1]['52w_min']
                last_sma_200 = df_slice.iloc[-1]['sma_200']
                last_sma_50 = df_slice.iloc[-1]['sma_50']

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
    time_frame = request.args.get('time_frame') or '1D'

    cache_key = f"symbols_review_{date}_{prepare_for}_{time_frame}"
    cached_data = redis_client.get(cache_key)

    if cached_data:
        return json.loads(cached_data)

    response = []
    sources = hose+hnx
    if prepare_for == 'hose':
        sources = hose
    elif prepare_for == 'hnx':
        sources = hnx
    for symbol in sources:
        try:
            cache_key_for_stock = f'stock_review_{symbol}_{date}'
            cached_data = redis_client.get(cache_key_for_stock)
            curStock = json.loads(cached_data)
            curStock['change']= curStock[f'change_{time_frame}']
        except:
            continue

        if curStock:
            response.append(curStock)
            
            
    response = sorted(response, key=lambda x: x['market_cap'], reverse=True)
    if prepare_for=='top_500':
        response= response[:500]
        
    redis_client.setex(cache_key, 24*60*60*7, json.dumps(response))
    return response[:]
