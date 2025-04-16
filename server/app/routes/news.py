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
from app.constant.constant import hose
import requests
import xml.etree.ElementTree as ET
import re

redis_client = redis.Redis(host='localhost', port=6379, db=0)

news_bp = Blueprint('news_bp', __name__)

@news_bp.route('/', methods=['GET'])
def fetch_news():
    news_category = request.args.get('category')
    news_sub_category = request.args.get('subcategory')
    
    url =news_link_to_xml[news_category][news_sub_category]
    
    headers = {
    "User-Agent": "Mozilla/5.0"
}
    response = requests.get(url,headers=headers)
    response.encoding = 'utf-8' 
    root = ET.fromstring(response.text)
    
    response =[]
    
    for node in root[0]:
        cur_news={}
        if node.tag=='item':
                cur_news['guild']= node[0].text
                cur_news['link']= node[1].text
                cur_news['title']= node[2].text
                
                description_raw= node[3].text
                src_match = re.search(r"src='([^']+)'", description_raw)
                img_src = src_match.group(1) if src_match else None
                text_content = re.sub(r"<img[^>]*>", "", description_raw).strip()
                
                cur_news['description']= text_content
                cur_news['img_src']= img_src
                    
                cur_news['public_date']= node[4].text
                response.append(cur_news)
    return response
        
        


news_link_to_xml={
    'stock':{
    'share': 'https://vietstock.vn/830/chung-khoan/co-phieu.rss',
    'insider_trading': 'https://vietstock.vn/739/chung-khoan/giao-dich-noi-bo.rss',
    'listed': 'https://vietstock.vn/741/chung-khoan/niem-yet.rss',
    'etf_and_funds': 'https://vietstock.vn/3358/chung-khoan/etf-va-cac-quy.rss',
    'derivatives': 'https://vietstock.vn/4186/chung-khoan/chung-khoan-phai-sinh.rss',
    'covered_warrant': 'https://vietstock.vn/4308/chung-khoan/chung-quyen.rss',
    'expert_opinion': 'https://vietstock.vn/145/chung-khoan/y-kien-chuyen-gia.rss',
    'investment_story': 'https://vietstock.vn/3355/chung-khoan/cau-chuyen-dau-tu.rss',
    'policy': 'https://vietstock.vn/143/chung-khoan/chinh-sach.rss',
    'bond': 'https://vietstock.vn/785/chung-khoan/thi-truong-trai-phieu.rss'
},
    'business':{
    'business_activity': 'https://vietstock.vn/737/doanh-nghiep/hoat-dong-kinh-doanh.rss',
    'dividend': 'https://vietstock.vn/738/doanh-nghiep/co-tuc.rss',
    'capital_increase_ma': 'https://vietstock.vn/764/doanh-nghiep/tang-von-m-a.rss',
    'ipo_equitization': 'https://vietstock.vn/746/doanh-nghiep/ipo-co-phan-hoa.rss',
    'character': 'https://vietstock.vn/214/doanh-nghiep/nhan-vat.rss',  
    'corporate_bond': 'https://vietstock.vn/3118/doanh-nghiep/trai-phieu-doanh-nghiep.rss'
} ,
    'real_estate':{
    'real_estate_market': 'https://vietstock.vn/4220/bat-dong-san/thi-truong-nha-dat.rss',
    'planning_infrastructure': 'https://vietstock.vn/42221/bat-dong-san/quy-hoach-ha-tang.rss',
    'real_estate_projects': 'https://vietstock.vn/4222/bat-dong-san/du-an.rss',
    'real_estate_insurance_tax': 'https://vietstock.vn/4266/bat-dong-san/bao-hiem-va-thue-nha-dat.rss'
},
    'goods':{
    'precious_metals': 'https://vietstock.vn/759/hang-hoa/vang-va-kim-loai-quy.rss',
    'fuel': 'https://vietstock.vn/34/hang-hoa/nhien-lieu.rss',
    'metal': 'https://vietstock.vn/742/hang-hoa/kim-loai.rss',
    'agriculture_food': 'https://vietstock.vn/118/hang-hoa/nong-san-thuc-pham.rss'
},
    'finance':{
    'banking': 'https://vietstock.vn/757/tai-chinh/ngan-hang.rss',
    'insurance': 'https://vietstock.vn/3113/tai-chinh/bao-hiem.rss',
    'tax_budget': 'https://vietstock.vn/758/tai-chinh/thue-va-ngan-sach.rss'
},
    'economy':{
    'macro': 'https://vietstock.vn/761/kinh-te/vi-mo.rss',
    'economy_investment': 'https://vietstock.vn/768/kinh-te/kinh-te-dau-tu.rss'
},
    'world':{
    'global_stocks': 'https://vietstock.vn/773/the-gioi/chung-khoan-the-gioi.rss',
    'crypto': 'https://vietstock.vn/4309/the-gioi/tien-ky-thuat-so.rss',
    'international_finance': 'https://vietstock.vn/772/the-gioi/tai-chinh-quoc-te.rss',
    'global_economy_industry': 'https://vietstock.vn/775/the-gioi/kinh-te-nganh.rss'
},
    'dong_duong':{
    'indochina_macro_investment': 'https://vietstock.vn/1326/dong-duong/vi-mo-dau-tu.rss',
    'indochina_finance_banking': 'https://vietstock.vn/1327/dong-duong/tai-chinh-ngan-hang.rss',
    'indochina_stock_market': 'https://vietstock.vn/1328/dong-duong/thi-truong-chung-khoan.rss',
    'indochina_economy_industry': 'https://vietstock.vn/1329/dong-duong/kinh-te-nganh.rss'
},
    'personal_finance':{
    'personal_finance_mastery': 'https://vietstock.vn/4260/tai-chinh-ca-nhan/lam-chu-dong-tien.rss',
    'small_investment_business': 'https://vietstock.vn/4261/tai-chinh-ca-nhan/dau-tu-kinh-doanh-nho.rss',
    'entrepreneurship_startup': 'https://vietstock.vn/4262/tai-chinh-ca-nhan/doanh-nhan-va-khoi-nghiep.rss',
    'luxury_lifestyle': 'https://vietstock.vn/4263/tai-chinh-ca-nhan/choi-sang.rss',
    'automotive_technology': 'https://vietstock.vn/4264/tai-chinh-ca-nhan/xe-cong-nghe.rss',
    'consumer_lifestyle': 'https://vietstock.vn/4265/tai-chinh-ca-nhan/tieu-dung-va-cuoc-song.rss',
    'for_community': 'https://vietstock.vn/735/tai-chinh-ca-nhan/vi-cong-dong.rss'
},
    'analysis':{
    'market_analysis': 'https://vietstock.vn/1636/nhan-dinh-phan-tich/nhan-dinh-thi-truong.rss',
    'fundamental_analysis': 'https://vietstock.vn/582/nhan-dinh-phan-tich/phan-tich-co-ban.rss',
    'technical_analysis': 'https://vietstock.vn/585/nhan-dinh-phan-tich/phan-tich-ky-thuat.rss'
}
}