from flask import Blueprint,request
import redis
import json
from vnstock import Vnstock
from vnstock.explorer.vci import Company
from app.constant.constant import bankCompany
from flask import jsonify
import pandas as pd
from datetime import datetime, timedelta

company_bp = Blueprint('company_bp', __name__)
redis_client = redis.Redis(host='localhost', port=6379, db=0)


@company_bp.route('/company_news_wichart', methods=['GET'])
def fetch_company_news_wichart():
    symbol= request.args.get('symbol')
    
    today = datetime.today()
    last_year = today.replace(year=today.year - 1)
    last_year_str = last_year.strftime("%Y-%m-%d")
    
    news_wichart= pd.read_csv('./data/data_2024.csv')
    news_wichart = news_wichart[news_wichart['Ticker'] == symbol.upper()]
    news_wichart['Date'] = pd.to_datetime(news_wichart['Date'])
    news_wichart = (
    news_wichart[news_wichart['Date'] <= last_year_str]
    .sort_values(by='Date', ascending=False)
    .iloc[:20])
   
    
    # Replace NaN with None (will become null in JSON)
    news_wichart = news_wichart.replace({pd.NA: None, float('nan'): None})
    news_wichart = news_wichart.where(pd.notna(news_wichart), None)
    
    response = {
        'news': news_wichart.to_dict(orient='records')
    }
    return jsonify(response)


@company_bp.route('/company_metadata', methods=['GET'])
def fetch_company_news():
    symbol= request.args.get('symbol')
    cache_key = f"company_news_{symbol}"
    cached_data = redis_client.get(cache_key)
    
    # Return cached data if available
    if cached_data:
        return jsonify(json.loads(cached_data))
    
    company_source_vci = Company(symbol)
    news_vci = company_source_vci.news()

    company_source_tcbs = Vnstock().stock(symbol=symbol, source='TCBS').company
    news_tcbs = company_source_tcbs.news()
    news_tcbs.fillna('', inplace=True)
    
 
    
    subsidiaries = None
    if symbol.upper() in bankCompany:
        subsidiaries = company_source_vci.subsidiaries()
        subsidiaries['sub_company_name']= subsidiaries['organ_name']
        subsidiaries['sub_own_percent']= subsidiaries['ownership_percent']
    else:
        subsidiaries = company_source_tcbs.subsidiaries()
        
    overview = company_source_vci.overview()
    officers = company_source_vci.officers(filter_by='all')
    
    
    response ={
        'news':{
        'news_vci': news_vci.to_dict(orient='records'),
        'news_tcbs': news_tcbs.to_dict(orient='records'),
        },
        'subsidiaries': subsidiaries.to_dict(orient='records'),
        'overview': overview.to_dict(orient='records'),
        'officers': officers.to_dict(orient='records'),
    }
    
    redis_client.set(cache_key, json.dumps(response), ex=3600)
    return jsonify(response)

