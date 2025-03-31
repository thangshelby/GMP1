from vnstock import Vnstock
from vnstock.explorer.vci import Company
import pandas as pd
import numpy as np
import requests
import pandas_ta as ta
import google.generativeai as genai
import redis    
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_general_information(company_overview):
    general_info ={}
    
    general_info['issue_share']= company_overview.get('issue_share', 'N/A').values[-1]
    general_info['ISIN_code']='VN000000HPG4'
    general_info['exchange_code']=company_overview['exchange'].values[-1]
    general_info['industry']=company_overview.get('industry').values[-1]

    general_info['no._of_employees']=int(company_overview.get('no_employees', 'N/A').values[-1])
   
    return general_info

def get_company_detail(company_overview):
    company_detail={}
    
    company_detail['address']='Viet Nam'
    company_detail['phone_number']= '028 7308 8888'    
    company_detail['website']=company_overview.get('website', 'N/A').values[-1]
    company_detail['company_short_name']=company_overview.get('short_name', 'N/A').values[-1]
    # company_detail['charter_capital']=company_overview.get('charter_capital', 'N/A').values[-1]
    
    return company_detail
    
def get_summary(symbol,type):
    cache_key = f"summary_{symbol}_{type}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return cached_data.decode('utf-8')
    
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
    user_input = f"Hãy cho tôi biết {type} Summary của công ty có ký hiệu là {symbol}(1 đoạn văn, ko xuống dòng và bằng tiếng anh formal nhất có thể dài dài 1 tí tầm 250 chữ, ko cần thêm biểu cảm. Mẫu nè {sample} )."   

    try:
        response = chat_session.send_message(user_input)
        model_response = response.text
        
        chat_session.history.append({"role": "user", "parts": [user_input]})
        chat_session.history.append({"role": "model", "parts": [model_response]})
        
        redis_client.set(cache_key, model_response, ex=3600)  
        return model_response
    except Exception as e:
        pass

def caculate_share_detail(df,company_overview,start_date,end_date):
    market_data= Vnstock().stock(symbol='VNINDEX', source='VCI')
    market_df= market_data.quote.history(start=start_date, end=end_date, interval="1D")
    
    
    share_detail = {}
    
    share_detail['close_price'] = df["close"].iloc[-1]
    df_52wk = df[df["time"] >= (pd.to_datetime(end_date) - pd.Timedelta(days=365))]
    share_detail['52_wk_high'] = df_52wk["high"].max() if not df_52wk.empty else np.nan
    share_detail['52_wk_low'] = df_52wk["low"].min() if not df_52wk.empty else np.nan
    
    
    share_detail['5_day_average_volume'] = df["volume"].rolling(window=5, min_periods=1).mean().iloc[-1]
    share_detail['10_day_average_volume']= df["volume"].rolling(window=10, min_periods=1).mean().iloc[-1]
    share_detail['currency'] = 'VND'
    # share_detail['shares_outstanding'] = folat(shares_outstanding) if isinstance(shares_outstanding, float) and not np.isnan(shares_outstanding) else 0
    
    df = df[['time', 'close']].rename(columns={'close': 'Stock'})
    market_df = market_df[['time', 'close']].rename(columns={'close': 'Market'})
    
    merge_df = pd.merge(df, market_df, on="time", how="inner")

    merge_df['Stock Return'] = np.log(merge_df['Stock'] / merge_df['Stock'].shift(1))
    merge_df['Market Return'] = np.log(merge_df['Market'] / merge_df['Market'].shift(1))

    merge_df = merge_df.dropna()

    cov_matrix = merge_df[['Stock Return', 'Market Return']].cov()
    share_detail['beta_value'] = cov_matrix.loc['Stock Return', 'Market Return'] / merge_df['Market Return'].var()
    share_detail['outstanding_share'] = company_overview['outstanding_share'].values[-1]
    
    return share_detail
    
def caculate_percentage_change(df,date):
    date= pd.to_datetime(date)
    percentage_change = {}
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
    
    return percent_change
    
def caculte_analyst_outlook(df):

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
        "recomendation": signal
    }
    # print(res)
    return res

def caculate_ratio(symbol):
    company= Company(symbol)
    company_ratio= company.ratio_summary()
    
    ratio={}
    ratio['price_to_earning'] = round(float(company_ratio['pe'].iloc[-1]), 2)
    ratio['earnings_per_share'] = round(float(company_ratio['eps'].iloc[-1]), 2)
    ratio['current_ratio'] = round(float(company_ratio['current_ratio'].iloc[-1]), 2)
    ratio['dividend'] = round(float(company_ratio['dividend'].iloc[-1]), 2)
    return ratio    
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