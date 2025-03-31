import pandas as pd
import google.generativeai as genai
def get_report_info(symbol='vcb'):
    symbol=symbol.upper()
    bankCompany=['ABB', 'ACB', 'BAB', 'BID', 'BVB', 'CTG', 'EIB', 'HDB', 'KLB', 'LPB', 'MBB', 'MSB', 'NAB', 'NVB', 'OCB', 'PGB', 'SGB', 'SHB', 'SSB', 'STB', 'TCB', 'TPB', 'VAB', 'VBB', 'VCB', 'VIB', 'VPB']
    years=['2020','2021','2022','2023','2024',2020,2021,2022,2023,2024]
   
   
    df=None
    if symbol in bankCompany:
        df= pd.read_excel('./app/data/data_financial_bank.xlsx')
        filtered_df = df[(df['Năm'].isin(years)) & (df['Mã'] == symbol)]
        company_name = filtered_df['Tên công ty'].values[0]

        balance_sheet_columns = ['Property/Plant/Equipment,Total - Net', 'Total Assets', 'Total Liabilities', 'Equity', 'Total liabilities and equity']
        balance_sheet_raw = filtered_df[balance_sheet_columns].to_dict(orient='records')

        balance_sheet = {}
        for item in balance_sheet_raw:
            for key, value in item.items():
                if key not in balance_sheet:
                    balance_sheet[key] = []
                balance_sheet[key].append(value)
        AIevaluation_balance = evaluate_table('Balance Sheet',company_name,balance_sheet)
       

        income_statement_columns = ['Net Income Before Taxes', 'Net Income After Taxes', 'Minority Interest', 'Profit attributable to parent company shareholders', 'EPS']
        income_statement_raw = filtered_df[income_statement_columns].to_dict(orient='records')

        income_statement = {}
        for item in income_statement_raw:
            for key, value in item.items():
                if key not in income_statement:
                    income_statement[key] = []
                income_statement[key].append(value)
        AIevaluation_income = evaluate_table('Income Statement',company_name,income_statement)
        

        profitability_analysis_columns = ['ROE', 'ROA', 'Total Debt/Equity']
        profitability_analysis_raw = filtered_df[profitability_analysis_columns].to_dict(orient='records')

        profitability_analysis = {}
        for item in profitability_analysis_raw:  
            for key, value in item.items():
                if key not in profitability_analysis:
                    profitability_analysis[key] = []
                profitability_analysis[key].append(value)
        AIevaluation_profitability = evaluate_table('Profitability Analysis',company_name,profitability_analysis)
        
        ai_analysis = {}
        ai_analysis['balance_sheet'] = AIevaluation_balance
        ai_analysis['income_statement'] = AIevaluation_income
        ai_analysis['profitability_analysis'] = AIevaluation_profitability
        # return ai_analysis
        return balance_sheet,income_statement,profitability_analysis,ai_analysis

     
    else:
        df= pd.read_excel('./app/data/financial_summary_updated.xlsx')


        filtered_df = df[(df['Năm'].isin(years)) & (df['Mã'] == symbol)]
        company_name = filtered_df['Tên công ty'].values[0]
        balance_sheet_columns=['Total Current Assets','Property/Plant/Equipment,Total - Net','Total Assets', 'Total Current Liabilities','Total Liabilities','Total Long-Term Debt','Equity']
        balance_sheet_raw= filtered_df[balance_sheet_columns].to_dict(orient='records')
        
        balance_sheet={}
        for item in balance_sheet_raw:
            for key,value in item.items():
                if key not in balance_sheet:
                    balance_sheet[key]=[]
                balance_sheet[key].append(value)
        # balance_sheet.fillna(0,inplace=True)
        AIevaluation_balance = evaluate_table('Balance Sheet',company_name,balance_sheet)
       
        income_statement_columns=['Revenue','Total Operating Expense','Operating Income','Net Income Before Taxes','Net Income After Taxes','Net Income Before Extra.\nItems']      
        income_statement_raw= filtered_df[income_statement_columns].to_dict(orient='records')
        income_statement={}
        for item in income_statement_raw:
            for key,value in item.items():
                if key not in income_statement:
                    income_statement[key]=[]
                income_statement[key].append(value)
        # income_statement.fillna(0,inplace=True)
        AIevaluation_income = evaluate_table('Income Statement',company_name,income_statement)
        
        
        
        profitability_analysis_columns=['ROE', 'ROA', 'Income After Tax Margin (%) (Biên lợi nhuận sau thuế)', 'Revenue/Tot Assets', 'Long Term Debt/Equity, %', 'Total Debt/Equity, %']    
        profitability_analysis_raw= filtered_df[profitability_analysis_columns]
        profitability_analysis_raw['Income After Tax Margin']= profitability_analysis_raw['Income After Tax Margin (%) (Biên lợi nhuận sau thuế)']
        profitability_analysis_raw.drop(columns=['Income After Tax Margin (%) (Biên lợi nhuận sau thuế)'],inplace=True)
        profitability_analysis={}
        for item in profitability_analysis_raw.to_dict(orient='records'):
            for key,value in item.items():
                if key not in profitability_analysis:
                    profitability_analysis[key]=[]
                profitability_analysis[key].append(value)
        AIevaluation_profitability = evaluate_table('Profitability Analysis',company_name,profitability_analysis)
       
       
        ai_analysis = {}
        ai_analysis['balance_sheet'] = AIevaluation_balance
        ai_analysis['income_statement'] = AIevaluation_income
        ai_analysis['profitability_analysis'] = AIevaluation_profitability
        # return ai_analysis
        return balance_sheet,income_statement,profitability_analysis,ai_analysis


def evaluate_table (table_name,symbol,table_value):
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
    
    
    # user_input = f"Hãy cho tôi biết Business và Financial Summary của công ty có ký hiệu là {symbol}(Hãy viết trong 2 đoạn văn 1 cái của business,1 cái của financial, xuống dòng 1 lần thôi nhé càng dài càng tốt và bằng tiếng anh formal nhất có thể, ko cần thêm biểu cảm )."   
    user_input =f"Đây là bảng {table_name} của công ty {symbol}:\n{table_value}. Bạn hãy đánh giá bảng này giúp tôi nhé.(Đánh giá trong 1 đoạn văn ko xuống dòng. Đơn giản, tổng quát là được rồi tiếng anh formal nhất có thể, ko cần thêm biểu cảm )"

    try:
        response = chat_session.send_message(user_input)
        model_response = response.text
        
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