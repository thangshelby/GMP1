from dotenv import load_dotenv
from app.config.config import generation_config,safety_settings,system_instruction,summary_sample,final_sample
import os
import redis    
import json
import google.generativeai as genai

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
