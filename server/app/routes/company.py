from flask import Blueprint,request
import redis
import json
from vnstock import Vnstock
from vnstock.explorer.vci import Company
from app.constant.constant import bankCompany

company_bp = Blueprint('company_bp', __name__)
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@company_bp.route('/news', methods=['GET'])
def fetch_company_news():
    symbol= request.args.get('symbol')
    cache_key = f"company_news_{symbol}"
    cached_data = redis_client.get(cache_key)
        
    company_source_vci = Company(symbol)
    news_vci = company_source_vci.news()

    company_source_tcbs = Vnstock().stock(symbol='VCB', source='TCBS').company
    news_tcbs = company_source_tcbs.news()
    
    subsidiaries = None
    if symbol.upper() in bankCompany:
        subsidiaries = company_source_vci.subsidiaries()
        subsidiaries['sub_company_name']= subsidiaries['organ_name']
        subsidiaries['sub_own_percent']= subsidiaries['ownership_percent']
    else:
        subsidiaries = company_source_tcbs.subsidiaries()
    
    response ={
        'news_vci': news_vci.to_dict(orient='records'),
        'news_tcbs': news_tcbs.to_dict(orient='records')   ,
        'subsidiaries': subsidiaries.to_dict(orient='records')
    }
    
    redis_client.set(cache_key, json.dumps(response), ex=3600)
    return response