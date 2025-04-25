import pandas as pd

from app.constant.constant import bankCompany, years
from app.utils.utils import get_AI_analyze


def get_report_info(symbol='vcb'):
    symbol = symbol.upper()
   
    df = None
    if symbol in bankCompany:
        df = pd.read_excel('./app/data/data_financial_bank.xlsx')
        filtered_df = df[(df['Năm'].isin(years)) & (df['Mã'] == symbol)]
        company_name = filtered_df['Tên công ty'].iloc[0]

        balance_sheet_columns = ['Property/Plant/Equipment,Total - Net', 'Total Assets', 'Total Liabilities', 'Equity', 'Total liabilities and equity']
        balance_sheet_raw = filtered_df[balance_sheet_columns].to_dict(orient='records')

        balance_sheet = {}
        for item in balance_sheet_raw:
            for key, value in item.items():
                if key not in balance_sheet:
                    balance_sheet[key] = []
                balance_sheet[key].append(value)
        AIevaluation_balance = get_AI_analyze(symbol=symbol.upper(), type='table', table_data={'name': 'Balance Sheet', 'value': balance_sheet})

        income_statement_columns = ['Net Income Before Taxes', 'Net Income After Taxes', 'Minority Interest', 'Profit attributable to parent company shareholders', 'EPS']
        income_statement_raw = filtered_df[income_statement_columns].to_dict(orient='records')

        income_statement = {}
        for item in income_statement_raw:
            for key, value in item.items():
                if key not in income_statement:
                    income_statement[key] = []
                income_statement[key].append(value)
        AIevaluation_income = get_AI_analyze(symbol=symbol.upper(), type='table', table_data={'name': 'Income Statement', 'value': income_statement})
        
        profitability_analysis_columns = ['ROE', 'ROA', 'Total Debt/Equity']
        profitability_analysis_raw = filtered_df[profitability_analysis_columns].to_dict(orient='records')

        profitability_analysis = {}
        for item in profitability_analysis_raw:  
            for key, value in item.items():
                if key not in profitability_analysis:
                    profitability_analysis[key] = []
                profitability_analysis[key].append(value)
        AIevaluation_profitability = get_AI_analyze(symbol=symbol.upper(), type='table', table_data={'name': 'Profitability Analysis', 'value': profitability_analysis})
        
        ai_analysis = {}
        ai_analysis['balance_sheet'] = AIevaluation_balance
        ai_analysis['income_statement'] = AIevaluation_income
        ai_analysis['profitability_analysis'] = AIevaluation_profitability
        # return ai_analysis
        return balance_sheet, income_statement, profitability_analysis, ai_analysis
     
    else:
        df = pd.read_excel('./app/data/financial_summary_updated.xlsx')

        filtered_df = df[(df['Năm'].isin(years)) & (df['Mã'] == symbol)]
        company_name = filtered_df['Tên công ty'].iloc[0]
        
        balance_sheet_columns = ['Total Current Assets', 'Property/Plant/Equipment,Total - Net', 'Total Assets', 'Total Current Liabilities', 'Total Liabilities', 'Total Long-Term Debt', 'Equity']
        balance_sheet_raw = filtered_df[balance_sheet_columns].to_dict(orient='records')
        
        balance_sheet = {}
        for item in balance_sheet_raw:
            for key, value in item.items():
                if key not in balance_sheet:
                    balance_sheet[key] = []
                balance_sheet[key].append(value)
        
        AIevaluation_balance = get_AI_analyze(symbol=symbol.upper(), type='table', table_data={'name': 'Balance Sheet', 'value': balance_sheet})
       
        income_statement_columns = ['Revenue', 'Total Operating Expense', 'Operating Income', 'Net Income Before Taxes', 'Net Income After Taxes', 'Net Income Before Extra.\nItems']      
        income_statement_raw = filtered_df[income_statement_columns].to_dict(orient='records')
        
        income_statement = {}
        for item in income_statement_raw:
            for key, value in item.items():
                if key not in income_statement:
                    income_statement[key] = []
                income_statement[key].append(value)
        
        AIevaluation_income = get_AI_analyze(symbol=symbol.upper(), type='table', table_data={'name': 'Income Statement', 'value': income_statement})
        
        profitability_analysis_columns = ['ROE', 'ROA', 'Income After Tax Margin (%) (Biên lợi nhuận sau thuế)', 'Revenue/Tot Assets', 'Long Term Debt/Equity, %', 'Total Debt/Equity, %']    
        profitability_df = filtered_df[profitability_analysis_columns].copy()
        
        # Rename column in pandas
        profitability_df.rename(columns={
            'Income After Tax Margin (%) (Biên lợi nhuận sau thuế)': 'Income After Tax Margin'
        }, inplace=True)
        
        profitability_analysis_raw = profitability_df.to_dict(orient='records')
        
        profitability_analysis = {}
        for item in profitability_analysis_raw:
            for key, value in item.items():
                if key not in profitability_analysis:
                    profitability_analysis[key] = []
                profitability_analysis[key].append(value)
        
        AIevaluation_profitability = get_AI_analyze(symbol=symbol.upper(), type='table', table_data={'name': 'Profitability Analysis', 'value': profitability_analysis})
       
        ai_analysis = {}
        ai_analysis['balance_sheet'] = AIevaluation_balance
        ai_analysis['income_statement'] = AIevaluation_income
        ai_analysis['profitability_analysis'] = AIevaluation_profitability
        
        return balance_sheet, income_statement, profitability_analysis, ai_analysis

