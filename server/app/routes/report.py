from flask import Blueprint,request,jsonify

import pandas as pd
from vnstock import Vnstock
import google.generativeai as genai
import redis
import json
from app.utils.business import get_stock_data, get_finance_data,calculate_stock_metrics,get_general_info_and_detail,get_summary
from app.utils.financial import get_report_info

redis_client = redis.Redis(host='localhost', port=6379, db=0)

report_bp = Blueprint('report_bp', __name__)
bankCompany=['ABB', 'ACB', 'BAB', 'BID', 'BVB', 'CTG', 'EIB', 'HDB', 'KLB', 'LPB', 'MBB', 'MSB', 'NAB', 'NVB', 'OCB', 'PGB', 'SGB', 'SHB', 'SSB', 'STB', 'TCB', 'TPB', 'VAB', 'VBB', 'VCB', 'VIB', 'VPB']

@report_bp.route('/business', methods=['GET'])
def create_report():
    
    symbol= request.args.get('symbol')
    date=   request.args.get('date')
    
    cache_key = f"report_business_{symbol}_{date}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return jsonify(json.loads(cached_data))
    
    res = calculate_stock_metrics(symbol, pd.to_datetime(date))
        
    general_info,company_detail= get_general_info_and_detail(symbol)
    business_summary= get_summary(symbol,"Business")
    financial_summary= get_summary(symbol,"Financial")
    
    res['general_infomation']= general_info
    res['company_detail']= company_detail
    res['business_summary']= business_summary
    res['financial_summary']= financial_summary
  
    redis_client.set(cache_key, json.dumps(res), ex=3600)
    
    
    return jsonify(res)


@report_bp.route('/financial', methods=['GET'])
def fetch_financial():
    symbol= request.args.get('symbol')
    
    cache_key = f"report_financial_{symbol}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return jsonify(json.loads(cached_data))
    
    res={}
    balance_sheet,income_statement, profitability_analysis,ai_analysis=get_report_info(symbol)
    res['balance_sheet']=balance_sheet
    res['income_statement']=income_statement
    res['profitability_analysis']=profitability_analysis
    res['ai_analysis']=ai_analysis
    
    redis_client.set(cache_key, json.dumps(res), ex=3600)
    return res

@report_bp.route('/financial/chart/asset_equity', methods=['GET'])
def fetch_financial_chart_asset_equity():
    symbol= request.args.get('symbol')
    df=None
    total_assets=[]
    equity=[]
    
    if symbol in bankCompany:
        df = pd.read_excel('./app/data/data_financial_bank.xlsx')
    else:
        df = pd.read_excel('./app/data/financial_summary_updated.xlsx')

    bank_data = df[df['Mã'] == symbol.upper()].sort_values(by='Năm')
    total_assets = bank_data['Total Assets'].tolist()
    equity = bank_data['Equity'].tolist()
    years = bank_data['Năm'].tolist()
    liabilities = bank_data['Total Liabilities'].tolist()
    
    
    res1={}
    res1['years']=years
    res1['total_assets']=total_assets
    res1['equity']=equity
    
    res2={}
    res2['years']=years
    res2['liabilities']=liabilities
    res2['equity']=equity
    
    res={}
    res['res1']=res1
    res['res2']=res2
    
    return res

@report_bp.route('/financial/chart/bar_and_line', methods=['GET'])
def overrall_financial():
    symbol= request.args.get('symbol')
    df=None
    equity=[]

    df = pd.read_excel('./app/data/financial_summary_updated.xlsx')


    bank_data = df[df['Mã'] == symbol.upper()].sort_values(by='Năm')
    years = bank_data['Năm'].tolist()
    
    total_assets = bank_data['Total Assets'].tolist()
    liabilities = bank_data['Total Liabilities'].tolist()
    equity = bank_data['Equity'].tolist()
    net_income_after_taxes = bank_data['Net Income After Taxes'].tolist()
    ebitda = bank_data['EBITDA'].tolist()
    
    res={}
    res['years']=years
    res['liabilities']=liabilities
    res['equity']=equity
    res['total_assets']=total_assets
    res['net_income_after_taxes']=net_income_after_taxes
    res['ebitda']=ebitda
    
    
    
    
    res2={}
    bank_code = symbol.upper()
    df_2024 = df[df['Năm'] == 2024]
    top_banks = df_2024.nlargest(6, 'Total Assets')

    if bank_code.upper() in top_banks['Mã'].values:
        top_banks = top_banks[top_banks['Mã'] != bank_code.upper()].head(5)
    else:
        top_banks = top_banks.head(5)

    bank_code_data = df_2024[df_2024['Mã'] == bank_code.upper()]

    banks = [bank_code.upper()] + top_banks['Mã'].tolist()
    roe_values = [float(bank_code_data['ROE'])] + top_banks['ROE'].tolist()
    assets_values = [float(bank_code_data['Total Assets'])] + top_banks['Total Assets'].tolist()

    colors = ['tab:blue' if bank == bank_code.upper() else 'tab:gray' for bank in banks]
    labels = [f'{bank}' for bank, assets in zip(banks, assets_values)]
    
    res2['labels']=labels
    res2['roe_values']=roe_values
    res2['assets_values']=assets_values

    
    final={}
    final['res1']=res
    final['res2']=res2
    
    return final

@report_bp.route('/financial/final_analysis', methods=['POST'])
def fetch_financial_chart_roe():
    symbol= request.args.get('symbol')
    data= request.get_json()
    
    
    
    financial_data= data['financialData']
    business_data= data['businessData']
    
    res= get_final_analysis(symbol,financial_data,business_data)
    
    return res


def get_final_analysis(symbol,financial_data,business_data):
    genai.configure(api_key='AIzaSyAds6_jTjsyhi6ZrTT9dG0YfCkipccpNDY')

    # Cấu hình model

    model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction="Chatbot này sẽ hoạt động như một broker chứng khoán chuyên nghiệp, hỗ trợ người dùng trong việc mua bán cổ phiếu và cung cấp tư vấn đầu tư. Nó sẽ phân tích dữ liệu thị trường để đưa ra các khuyến nghị mua hoặc bán cổ phiếu, dựa trên xu hướng hiện tại và lịch sử giao dịch. Ngoài ra, chatbot còn cung cấp thông tin thị trường được cập nhật liên tục, bao gồm các chỉ số chứng khoán, tin tức về thị trường, và báo cáo phân tích tài chính của các công ty, giúp người dùng có được cái nhìn sâu sắc và đầy đủ về tình hình tài chính và kinh tế mà họ quan tâm.",
    )

    chat_session = model.start_chat(
        history=[]
    )
    # user_input = update.message.text
    
    sample='based on the financial and business data you provided for Hoa Phat Group (HPG), heres a concise analysis to inform your investment decision: Hoa Phat Group demonstrates characteristics of a growing company, as evidenced by the increasing trend in total assets and equity on its balance sheet. The companys core steel manufacturing operations, spanning from iron ore mining to finished products, position it as a key player in the Vietnamese steel industry. Revenue has fluctuated over the period, impacting operating and net income, which suggests sensitivity to market conditions. Profitability metrics like ROE and ROA show variability, indicating inconsistent efficiency in utilizing equity and assets. However, the relatively stable and low Long Term Debt/Equity ratio suggests a conservative approach to long-term financing. Analyst outlook leans towards "Sell," which should be considered carefully. The compans strategic focus on technological innovation and capacity expansion aims to maintain its leading position. However, the financial performance is significantly influenced by steel price fluctuations and demand in the construction and manufacturing sectors. Given the'
    user_input = f"Tôi sẽ cung cấp cho bạn financialData và businessData của mã cổ phiếu {symbol} để bạn có thể phần tích tổng quát về tình hình của công ty đưa ra quyết định có nên đầu tư. Dưới đây là financialData: {financial_data} và businessData: {business_data},chỉ cần làm đoạn văn, không xuống dòng tieeng anh cho tôi khoang tam 300 chu la duoc roi mẫu nè {sample}"   

    try:
        response = chat_session.send_message(user_input)
        model_response = response.text
        
        chat_session.history.append({"role": "user", "parts": [user_input]})
        chat_session.history.append({"role": "model", "parts": [model_response]})
        return model_response
    except Exception as e:
        pass
    
    
generation_config = {
  "temperature": 0,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE",
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
  },
]