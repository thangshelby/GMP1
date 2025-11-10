import joblib
import pandas as pd

# Load model từ file joblib
model = joblib.load('data/stock_predictor_model.joblib')


date='2024-11-06'
symbol='TCB'

# Đọc dữ liệu từ file CSV
df_prepare = pd.read_csv('data/data_cleaned_no_outliers.csv')

df_prepare = df_prepare[df_prepare['Ticker'] == symbol]

print(df_prepare)
# Lấy dòng đầu tiên (1 dòng)
row_1 = df_prepare.iloc[:-1]

# Dự đoán
prediction = model.predict(row_1)
print("Giá dự đoán:", prediction[0])
