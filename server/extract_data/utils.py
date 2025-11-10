import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pmdarima import auto_arima

# ==== 1. Load dữ liệu ====
df = pd.read_excel("ĐTTC.xlsx", sheet_name="Dữ liệu")
df = df.rename(columns={"Date": "ds", "VNINDEX": "y"})

# Convert Excel serial date nếu cần
if df['ds'].dtype != 'datetime64[ns]':
    df['ds'] = pd.to_datetime(df['ds'], unit='D', origin='1899-12-30')

# Set index theo ds (ARIMA cần time index)
df = df.set_index("ds")

# ==== 2. Train ARIMA / SARIMA tự động chọn ====
model = auto_arima(
    df["y"],
    seasonal=True,       # SARIMA
    m=7,                 # season weekly (bạn có thể đổi sang 30 cho tháng)
    trace=True,          # in log
    error_action="ignore",
    suppress_warnings=True
)

print(f"✅ Selected ARIMA order: {model.order}, Seasonal order: {model.seasonal_order}")

# ==== 3. Dự báo 365 ngày ====
n_periods = 365
forecast, conf_int = model.predict(n_periods=n_periods, return_conf_int=True)

future_index = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=n_periods)
future_df = pd.DataFrame({
    "ds": future_index,
    "Fit/Forecast": forecast,
    "LCL": conf_int[:, 0],
    "UCL": conf_int[:, 1]
})

# ==== 4. Combine với dữ liệu gốc ====
df_reset = df.reset_index().rename(columns={"y": "Observed"})
result = pd.concat([df_reset, future_df], axis=0)

result.to_excel("forecast_vnindex_arima.xlsx", index=False)
print("✅ Đã tạo file forecast_vnindex_arima.xlsx")

# ==== 5. Vẽ biểu đồ ====
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['y'], label='Observed', color='red', linewidth=1)
plt.plot(future_df['ds'], future_df['Fit/Forecast'], label='Fit/Forecast (ARIMA)', color='blue')
plt.fill_between(future_df['ds'], future_df['LCL'], future_df['UCL'], color='purple', alpha=0.2, label='UCL / LCL')
plt.axvline(df.index[-1], color='black', linewidth=2)

plt.title("Dự báo VNINDEX 1 năm tới (ARIMA/SARIMA)")
plt.xlabel("Date")
plt.ylabel("VNINDEX")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show(block=True)

plt.savefig("forecast_vnindex_arima.png", bbox_inches='tight')
plt.close()
print("✅ Đã tạo file forecast_vnindex_arima.png")
