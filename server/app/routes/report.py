from flask import Blueprint,request,jsonify
import pandas as pd
from vnstock import Vnstock
import google.generativeai as genai
import redis
import json
from app.utils.business import get_general_information,get_company_detail,caculte_analyst_outlook,caculate_share_detail,caculate_percentage_change,caculate_ratio
from app.utils.financial import get_report_info
from app.utils.utils import get_AI_analyze

redis_client = redis.Redis(host='localhost', port=6379, db=0)

report_bp = Blueprint('report_bp', __name__)
bankCompany=['ABB', 'ACB', 'BAB', 'BID', 'BVB', 'CTG', 'EIB', 'HDB', 'KLB', 'LPB', 'MBB', 'MSB', 'NAB', 'NVB', 'OCB', 'PGB', 'SGB', 'SHB', 'SSB', 'STB', 'TCB', 'TPB', 'VAB', 'VBB', 'VCB', 'VIB', 'VPB']

@report_bp.route('/business', methods=['GET'])
def create_report():
    
    symbol= request.args.get('symbol')
    start_date= request.args.get('start_date')
    end_date= request.args.get('end_date')
    
    cache_key =f"report_business_{symbol}_{start_date}_{end_date}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return jsonify(json.loads(cached_data))
    
    stock = Vnstock().stock(symbol=symbol,source='TCBS')
    df= stock.quote.history(start=start_date, end=end_date, interval='1D')
    
    # res = calculate_stock_metrics(symbol, pd.to_datetime(date))
        
    res={}
    res['general_information']= get_general_information(stock.company.overview(),symbol)
    res['company_detail']= get_company_detail(stock.company.overview())
    res['business_summary']= get_AI_analyze(symbol, type='summary', summary_data='business')
    res['financial_summary']= get_AI_analyze(symbol, type='summary', summary_data='financial')
    
    res['analyst_outlook']= caculte_analyst_outlook(df)
    res['share_detail']= caculate_share_detail(df,stock.company.overview(),start_date,end_date)
    res['percentage_change']= caculate_percentage_change(df,end_date)
    res['ratio']= caculate_ratio(symbol)
    
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
   
    
    res= get_AI_analyze(symbol,type='final',final_data={'financial_data':financial_data,'business_data':business_data})

    
    return jsonify(res)

@report_bp.route('/financial_report', methods=['GET'])
def fetch_financial_report():
    
    symbol= request.args.get('symbol')
    period= request.args.get('period')
    
    cache_key = f"financial_report_{symbol}_{period}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return jsonify(json.loads(cached_data))
    
    stock = Vnstock().stock(symbol=symbol, source='VCI')
    balance_sheet = stock.finance.balance_sheet(period=period,lang='en')    
    # balance_sheet = balance_sheet[valid_balance_sheet_cols]
    balance_sheet.drop(columns=['ticker','yearReport'], inplace=True)
    income_statement = stock.finance.income_statement(period=period,lang='en')
    # income_statement = income_statement[valid_income_statement_cols]
    income_statement.drop(columns=['ticker','yearReport'], inplace=True)
    cash_flow = stock.finance.cash_flow(period=period,lang='en')
    # cash_flow = cash_flow[valid_cash_flow_cols]
    cash_flow.drop(columns=['ticker','yearReport'], inplace=True)

    response={}
    response['balance_sheet']=balance_sheet.to_dict(orient='list')
    response['income_statement']=income_statement.to_dict(orient='list')
    response['cash_flow']=cash_flow.to_dict(orient='list')
    
    
    
    # redis_client.set(cache_key, jsonify(response), ex=3600)
    
    return jsonify(response)

valid_balance_sheet_cols = [
    'Capital',
    "Cash and cash equivalents (Bn. VND)",
    'Fixed assets (Bn. VND)',
    "Investment Securities",
    'LIABILITIES (Bn. VND)',
    "Long-term investments (Bn. VND)",
    "Intagible fixed assets",
    'Other Assets',
    'Other long-term assets (Bn. VND)',
    "TOTAL ASSETS (Bn. VND)",
    "LIABILITIES (Bn. VND)",
    "Other liabilities",
    "OWNER'S EQUITY(Bn.VND)",
    "MINORITY INTERESTS",
    'Paid-in capital (Bn. VND)',
    'Reserves',
    'TOTAL RESOURCES (Bn. VND)',
]

valid_income_statement_cols = [
    'Business income tax - current',
    'Business income tax - deferred',
    'Dividends received',
    'EPS_basis',
    'Net Interest Income',
    'Net Other income/(expenses)',
    'Net Other income/expenses',
    'Net Profit For the Year',
    'Other expenses',
    'Profit before tax',
    'Provision for credit losses',
    'Revenue (Bn. VND)',
    'Tax For the Year',
    'Total operating revenue',   
]
valid_cash_flow_cols = [
    'Net cash inflows/outflows from operating activities',  
    'Purchase of fixed assets',                             
    'Net Cash Flows from Investing Activities',             
    'Cash flows from financial activities',                 
    'Net increase/decrease in cash and cash equivalents',  
    'Proceeds from disposal of fixed assets',             
    'Investment in other entities',                       
    'Proceeds from divestment in other entities',           
    'Dividends paid',                                  
    'Increase in charter captial',
    'Dividends paid',
     'Cash and cash equivalents',    
]