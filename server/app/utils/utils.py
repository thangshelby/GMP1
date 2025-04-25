import json
import os
from datetime import datetime, timedelta

import google.generativeai as genai
import pandas as pd
import redis
from dotenv import load_dotenv
from vnstock import Vnstock

from app.config.config import (
    final_sample,
    generation_config,
    safety_settings,
    summary_sample,
    system_instruction,
)
from app.constant.constant import hnx, hose
from app.utils.stock import analyze_stock_signal

redis_client = redis.Redis(host='localhost', port=6379, db=0)
load_dotenv()

def get_AI_analyze(symbol,type=None,summary_data=None,table_data=None,final_data=None):
    cache_key= f"AI_analyze_{symbol}_{type}_{summary_data}_{table_data}_{final_data}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return cached_data.decode('utf-8')
    
    api_key= os.getenv('GEMINI_API_KEY')
    genai.configure(api_key=api_key)

    # Cấu hình model

    model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction=system_instruction,
    )

    chat_session = model.start_chat(
        history=[]
    )
    
    user_input= None
    if type == 'summary':
        user_input = f"Hãy cho tôi biết {summary_data} Summary của công ty có ký hiệu là {symbol}(1 đoạn văn, ko xuống dòng và bằng tiếng anh formal nhất có thể , ko cần thêm biểu cảm. Mẫu nè {summary_sample} )." 
        
    elif type == 'table':
        user_input =f"Đây là bảng {table_data['name']} của công ty {symbol}:\n{table_data['value']}. Bạn hãy đánh giá bảng này giúp tôi nhé.(Đánh giá trong 1 đoạn văn ko xuống dòng. Tổng quát , phân tích cụ thể xíu là được rồi, dài 1 xíu nha cụ thể nữa, làm bằng tiếng anh formal nhất có thể, ko cần thêm biểu cảm )"
          
    else : 
        user_input = f"Tôi sẽ cung cấp cho bạn financialData và businessData của mã cổ phiếu {symbol} để bạn có thể phần tích tổng quát về tình hình của công ty đưa ra quyết định có nên đầu tư. Dưới đây là financialData: {final_data['financial_data']} và businessData: {final_data['business_data']},chỉ cần làm đoạn văn, không xuống dòng tiếng  anh cho tôi khoang tam 300 chu la duoc roi mẫu nè {final_sample}" 

    try:
        response = chat_session.send_message(user_input)
        model_response = response.text
        
        chat_session.history.append({"role": "user", "parts": [user_input]})
        chat_session.history.append({"role": "model", "parts": [model_response]})
        
        redis_client.set(cache_key, model_response, ex=3600)  
        return model_response
    except Exception as e:
        pass


def find_near_valid_date(date):
    df = pd.read_csv('./app/data/hose/AAA.txt', sep='\t')
    while date not in df["time"].tolist():
        date = datetime.strptime(date, '%Y-%m-%d')+timedelta(days=1)
        date = date.strftime('%Y-%m-%d')
    return date

def convert_timestamp_to_datestring(df):
    df['time'] = pd.to_datetime(df['time'])
    df['time'] = df['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    
    return df

def prepare_data_for_market_review():
    date = datetime.now().replace(year=2024).strftime('%Y-%m-%d')
    date = find_near_valid_date(date)
    
    sources = hose+hnx
    for symbol in sources:
        curStock = {}
        df = None
        company_overview = None
        try:
            df = pd.read_csv(f'./app/data/hose/{symbol}.txt', sep='\t')
            company_overview = pd.read_csv(f'./app/data/hose_final_overview/{symbol}.txt', sep='\t')
        except:
            try:
                source_path = 'hnx'
                df = pd.read_csv(f'./app/data/hnx/{symbol}.txt', sep='\t')
                company_overview = pd.read_csv(f'./app/data/hnx_final_overview/{symbol}.txt', sep='\t')
            except:
                continue
        df = df[df['time'] <= date]
        if len(df) > 1:
                signal = None
                try:
                    signal = analyze_stock_signal(df)
                except:
                    signal = 'Không có tín hiệu'
                
                # Get the last row values
                last_row = company_overview.tail(1)
                short_name = last_row['short_name'].iloc[0].split('(')[0]
                
                curStock['name'] = short_name
                curStock['sector'] = last_row['icb_name2'].iloc[0]
                
                # Using coalesce logic for industry
                industry_options = [
                    last_row['icb_name4'].iloc[0],
                    last_row['icb_name3'].iloc[0],
                    last_row['icb_name2'].iloc[0]
                ]
                industry = next((i for i in industry_options if i is not None), None)
                
                curStock['industry'] = industry
                curStock['signal'] = signal
                curStock['symbol'] = symbol
                curStock['exchange  '] = company_overview['exchange'].iloc[0]
                
                last_close = df.tail(1)['close'].iloc[0]
                curStock['last'] = round(last_close, 2) 
                for time_frame in prepare_time_frame_price:
                    second_last_close = df.tail(1+time_frame['value']).head(1)['close'].iloc[0]
                    curStock[f'change_{time_frame["key"]}'] = round((last_close - second_last_close) / second_last_close * 100, 2)
                
        
                
                curStock['market_cap'] = round(last_row['issue_share'].iloc[0] * last_close, 2)
                curStock['volume'] = int(df.tail(1)['volume'].iloc[0])
                redis_client.set(f'stock_review_{symbol}_{date}', json.dumps(curStock), ex=3600*24*24)
                
                
    print('Prepare data for market review done')
prepare_time_frame_price=[
    {
        'key': '1D',
        'value':1
    },
    {
        'key': '1W',
        'value':5
    },
    {
        'key': '1M',
        'value':21
    },
    {
        'key': '3M',
        'value':63
    },
    {
        'key': '6M',
        'value':126
    },
    {
        'key': '1Y',
        'value':252
    }
    
]