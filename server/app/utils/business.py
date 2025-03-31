from vnstock import Vnstock
import pandas as pd
import numpy as np
import requests
import pandas_ta as ta

import google.generativeai as genai

def get_stock_data(symbol, start_date="2020-01-01", end_date="2024-12-31"):
    stock = Vnstock().stock(symbol=symbol, source="VCI")
    df = stock.quote.history(start=start_date, end=end_date, interval="1D")
    market_data= Vnstock().stock(symbol='VNINDEX', source='VCI')
    market_df= market_data.quote.history(start=start_date, end=end_date, interval="1D")
    
    if df is not None and not df.empty:
        df["time"] = pd.to_datetime(df["time"])  
        return df,market_df, stock
    return None, None,None


def get_finance_data(stock, symbol, date):
    finance_data = stock.finance.ratio()

    if finance_data.empty:
        return np.nan, np.nan, np.nan
    year = date.year
    quarter = (date.month - 1) // 3 + 1
    finance_filtered = finance_data[
        (finance_data[("Meta", "ticker")] ==symbol.upper() ) &
        (finance_data[("Meta", "yearReport")] == year) &
        (finance_data[("Meta", "lengthReport")] == quarter)
    ]
    
    if finance_filtered.empty:
        return np.nan, np.nan, np.nan
   
    
    shares_outstanding = finance_filtered.get(("Chỉ tiêu định giá", "Outstanding Share (Mil. Shares)"), np.nan).values[-1]
    pe_ttm = finance_filtered.get(("Chỉ tiêu định giá", "P/E"), np.nan).values[-1]
    dividend_yield = finance_filtered.get(("Chỉ tiêu khả năng sinh lợi", "Dividend yield (%)"), np.nan).values[-1]
 
    return shares_outstanding, pe_ttm, dividend_yield

def calculate_stock_metrics(symbol, date):
    df,market_df ,stock = get_stock_data(symbol)
    if df is None or df.empty:
        return None

    df = df[df["time"] <= date]
    if df.empty:
        return None
    
    
    shares_outstanding, pe_ttm, dividend_yield = get_finance_data(stock, symbol, date)
    
    df_52wk = df[df["time"] >= (date - pd.Timedelta(days=365))]
    high_52wk = df_52wk["high"].max() if not df_52wk.empty else np.nan
    low_52wk = df_52wk["low"].min() if not df_52wk.empty else np.nan
    ratio_52wk = high_52wk / low_52wk if low_52wk > 0 else np.nan
    
    avg_vol_5d = df["volume"].rolling(window=5, min_periods=1).mean().iloc[-1]
    avg_vol_10d = df["volume"].rolling(window=10, min_periods=1).mean().iloc[-1]
    
    df["returns"] = df["close"].pct_change()
    beta_value = df["returns"].cov(df["returns"]) / df["returns"].var() if df["returns"].var() != 0 else np.nan
    
    def percentage_change(days):
        if len(df) < days:
            return np.nan
        return round(((df["close"].iloc[-1] - df["close"].iloc[-days]) / df["close"].iloc[-days]) * 100,2)
    
    percent_change = {
        "1_day": percentage_change(1),
        "5_day": percentage_change(5),
        "3_months": percentage_change(63),
        "6_months": percentage_change(126),
        "month_to_date": percentage_change(df[df["time"].dt.month == date.month].shape[0]),
        "year_to_date": percentage_change(df[df["time"].dt.year == date.year].shape[0]),
    }
    
    analyst_outlook =analyze_stock_data(df)

    return {
    'symbol': symbol,
    'date': date.strftime("%Y-%m-%d"),
    'share_detail': {
        '52_wk_high': round(high_52wk,2),
        '52_wk_low': round(low_52wk,2),
        '5_day_avg_volume': round(avg_vol_5d,2),
        '10_day_avg_volume': round(avg_vol_10d,2),
        'beta_value': round(beta_value,2),
        'close_price': round(df['close'].iloc[-1],2)*1000,
        'currency': 'VND',
        'shares_outstanding': float(shares_outstanding) if isinstance(shares_outstanding, float) and not np.isnan(shares_outstanding) else 0
    },
    'ratio': {
        'pe_ttm': float(pe_ttm) if isinstance(pe_ttm, float) and not np.isnan(pe_ttm) else 0,
        'dividend_yield': float(dividend_yield) if isinstance(dividend_yield, float) and not np.isnan(dividend_yield) else 0
    },
    'percentage_change': percent_change,
    'analyst_outlook': {
    'buy': analyst_outlook['buy'],
    'hold': analyst_outlook['hold'],
    'sell': analyst_outlook['sell'],
    'suggest': analyst_outlook['suggest']
    }
}



def get_general_info_and_detail(symbol):
    company = Vnstock().stock(symbol=symbol, source='TCBS').company
    company_overview = company.overview()
    
    general_info ={}
    company_detail={}
    
    general_info['issue_share']= company_overview.get('issue_share', 'N/A').values[-1]
    general_info['ISIN_code']='VN000000HPG4'
    general_info['exchange_code']=company_overview.get('exchange', 'N/A').values[-1]
    general_info['industry']=company_overview.get('industry', 'N/A').values[-1]

    general_info['no._of_employees']=int(company_overview.get('no_employees', 'N/A').values[-1])

    
    company_detail['address']='Viet Nam'
    company_detail['phone_number']= '028 7308 8888'    
    company_detail['website']=company_overview.get('website', 'N/A').values[-1]
    company_detail['company_short_name']=company_overview.get('short_name', 'N/A').values[-1]
    # company_detail['charter_capital']=company_overview.get('charter_capital', 'N/A').values[-1]
    
    return general_info,company_detail

def get_summary(symbol,type):
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
    sample='business and financial summary for VIB (Vietnam International Bank), presented in a formal and comprehensive manner: Vietnam International Bank (VIB) operates as a commercial bank, providing a comprehensive suite of financial products and services to a diverse clientele, including individual customers, small and medium-sized enterprises (SMEs), and corporate clients. The banks core business activities encompass deposit accounts, lending solutions (such as personal loans, mortgages, and business loans), credit cards, and wealth management services.'
    user_input = f"Hãy cho tôi biết {type} Summary của công ty có ký hiệu là {symbol}(1 đoạn văn, ko xuống dòng và bằng tiếng anh formal nhất có thể dài dài 1 tí tầm 150 chữ, ko cần thêm biểu cảm. Mẫu nè {sample} )."   

    try:
        response = chat_session.send_message(user_input)
        model_response = response.text
        
        chat_session.history.append({"role": "user", "parts": [user_input]})
        chat_session.history.append({"role": "model", "parts": [model_response]})
        return model_response
    except Exception as e:
        pass


def analyze_stock_data(df):

    # Tính các chỉ báo kỹ thuật
    #Tính MA
    df['MA10'] = df['close'].rolling(window=10).mean()
    df['MA20'] = df['close'].rolling(window=20).mean()
    df['MA50'] = df['close'].rolling(window=50).mean()

    #Tính BB
    middle_bb = df['close'].rolling(window=20).mean().iloc[-1]
    std_dev = df['close'].rolling(window=20).std().iloc[-1]
    df['Middle_BB'] = middle_bb
    df['Upper_BB'] = middle_bb + 2 * std_dev
    df['lower_BB'] = middle_bb - 2 * std_dev

    # Tính RSI
    df['RSI'] = ta.rsi(close=df['close'], length=14)

    # Tính MACD
    df['MACD'] = df['close'].ewm(span=12, adjust=False).mean() - df['close'].ewm(span=26, adjust=False).mean()
    df['Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()

    # Tính MFI
    # 1. Typical Price
    df['Typical_Price'] = (df['high'] + df['low'] + df['close']) / 3

    # 2. Raw Money Flow
    df['Raw_Money_Flow'] = df['Typical_Price'] * df['volume']

    # 3. Money Flow Positive/Negative
    df['Positive_Flow'] = df['Raw_Money_Flow'].where(df['Typical_Price'] > df['Typical_Price'].shift(1), 0)
    df['Negative_Flow'] = df['Raw_Money_Flow'].where(df['Typical_Price'] < df['Typical_Price'].shift(1), 0)

    # 4. Rolling Sum for 14 periods
    df['Positive_Flow_Sum'] = df['Positive_Flow'].rolling(window=14).sum()
    df['Negative_Flow_Sum'] = df['Negative_Flow'].rolling(window=14).sum()

    # 5. Money Flow Ratio
    df['Money_Flow_Ratio'] = df['Positive_Flow_Sum'] / df['Negative_Flow_Sum']

    # 6. MFI Calculation
    df['MFI'] = 100 - (100 / (1 + df['Money_Flow_Ratio']))

    # Khối lượng
    df['volume_avg'] = df['volume'].rolling(window=20).mean()

    # Lấy dữ liệu ngày hiện tại
    last_index = df.last_valid_index()


    # Đưa ra tín hiệu giao dịch
    buy_criteria = [
        df.loc[last_index, 'MA10'] > df.loc[last_index, 'MA20'],
        df.loc[last_index, 'MA10'] > df.loc[last_index, 'MA50'],
        df.loc[last_index, 'RSI'] < 20,
        df.loc[last_index, 'MACD'] > df.loc[last_index, 'Signal'],
        df.loc[last_index, 'close'] < df.loc[last_index, 'lower_BB'],
        df.loc[last_index, 'MFI'] < 20,
        df.loc[last_index, 'volume'] > df.loc[last_index, 'volume_avg']
    ]

    sell_criteria = [
        df.loc[last_index, 'MA10'] < df.loc[last_index, 'MA20'],
        df.loc[last_index, 'MA10'] < df.loc[last_index, 'MA50'],
        df.loc[last_index, 'RSI'] > 80,
        df.loc[last_index, 'MACD'] < df.loc[last_index, 'Signal'],
        df.loc[last_index, 'close'] > df.loc[last_index, 'Upper_BB'],
        df.loc[last_index, 'MFI'] > 80,
        df.loc[last_index, 'volume'] < df.loc[last_index, 'volume_avg']
    ]

    hold_criteria = [
        df.loc[last_index, 'MA10'] == df.loc[last_index, 'MA20'],  # MA10 giao cắt ngang MA20
        df.loc[last_index, 'RSI'] > 30 and df.loc[last_index, 'RSI'] < 70,  # RSI ở mức trung tính
        df.loc[last_index, 'MACD'] == df.loc[last_index, 'Signal'],  # MACD không có chênh lệch
        df.loc[last_index, 'close'] > df.loc[last_index, 'lower_BB'] and df.loc[last_index, 'close'] < df.loc[last_index, 'Upper_BB'],  # Giá nằm trong Bollinger Bands
        df.loc[last_index, 'MFI'] > 30 and df.loc[last_index, 'MFI'] < 70,  # MFI ở mức trung bình
    ]

    buy = sum(buy_criteria)
    sell = sum(sell_criteria)
    hold = sum(hold_criteria)

    if buy > sell and buy > hold:
        signal = "Mua"
    elif sell > buy and sell > hold:
        signal = "Bán"
    elif hold > sell and hold > buy:
        signal = "Nắm giữ"
    else:
        signal = "Chưa có tín hiệu rõ ràng"

    res= {
        "buy": int(buy),
        "hold": int(hold),
        "sell": int(sell),
        "suggest": signal
    }
    # print(res)
    return res

        
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