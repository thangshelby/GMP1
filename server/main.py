# import google.generativeai as genai
# api_key= "AIzaSyDYHx33O5kzncMXO4VlHdaXUuQC4VtfzHg"
# genai.configure(api_key=api_key)

# model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp")

# chat_session = model.start_chat(history=[])

# response = chat_session.send_message("Hello, how are you?")
# print(response.text)

from vnstock import Vnstock
import pandas as pd
stock = Vnstock().stock(symbol='VCB', source='VCI')
df= stock.quote.history(symbol='VCB', start='2024-01-01', end='2024-02-01', interval='1D')

df= df.dropna()
df = df.reset_index(drop=True)
df['time'] = pd.to_datetime(df['time'])
df['time'] = df['time'].dt.strftime('%Y-%m-%d-%H-%M')

print(df)