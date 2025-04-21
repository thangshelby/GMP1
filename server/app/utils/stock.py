import pandas_ta as ta
import polars as pl


def analyze_stock_signal(df):
    # Convert polars DataFrame to pandas DataFrame if it's a polars DataFrame
    # This is because pandas_ta requires a pandas DataFrame
    if isinstance(df, pl.DataFrame):
        pandas_df = df.to_pandas()
    else:
        pandas_df = df
        
    # Tính các chỉ báo kỹ thuật
    # Tính MA
    pandas_df['MA10'] = pandas_df['close'].rolling(window=10).mean()
    pandas_df['MA20'] = pandas_df['close'].rolling(window=20).mean()
    pandas_df['MA50'] = pandas_df['close'].rolling(window=50).mean()

    # Tính BB
    middle_bb = pandas_df['close'].rolling(window=20).mean().iloc[-1]
    std_dev = pandas_df['close'].rolling(window=20).std().iloc[-1]
    pandas_df['Middle_BB'] = middle_bb
    pandas_df['Upper_BB'] = middle_bb + 2 * std_dev
    pandas_df['lower_BB'] = middle_bb - 2 * std_dev

    # Tính RSI
    pandas_df['RSI'] = ta.rsi(close=pandas_df['close'], length=14)

    # Tính MACD
    pandas_df['MACD'] = pandas_df['close'].ewm(span=12, adjust=False).mean() - pandas_df['close'].ewm(span=26, adjust=False).mean()
    pandas_df['Signal'] = pandas_df['MACD'].ewm(span=9, adjust=False).mean()

    # Tính MFI
    # 1. Typical Price
    pandas_df['Typical_Price'] = (pandas_df['high'] + pandas_df['low'] + pandas_df['close']) / 3

    # 2. Raw Money Flow
    pandas_df['Raw_Money_Flow'] = pandas_df['Typical_Price'] * pandas_df['volume']

    # 3. Money Flow Positive/Negative
    pandas_df['Positive_Flow'] = pandas_df['Raw_Money_Flow'].where(pandas_df['Typical_Price'] > pandas_df['Typical_Price'].shift(1), 0)
    pandas_df['Negative_Flow'] = pandas_df['Raw_Money_Flow'].where(pandas_df['Typical_Price'] < pandas_df['Typical_Price'].shift(1), 0)

    # 4. Rolling Sum for 14 periods
    pandas_df['Positive_Flow_Sum'] = pandas_df['Positive_Flow'].rolling(window=14).sum()
    pandas_df['Negative_Flow_Sum'] = pandas_df['Negative_Flow'].rolling(window=14).sum()

    # 5. Money Flow Ratio
    pandas_df['Money_Flow_Ratio'] = pandas_df['Positive_Flow_Sum'] / pandas_df['Negative_Flow_Sum']

    # 6. MFI Calculation
    pandas_df['MFI'] = 100 - (100 / (1 + pandas_df['Money_Flow_Ratio']))

    # Khối lượng
    pandas_df['volume_avg'] = pandas_df['volume'].rolling(window=20).mean()

    # Lấy dữ liệu ngày hiện tại
    last_index = pandas_df.index[-1]

    # Đưa ra tín hiệu giao dịch
    buy_criteria = [
        pandas_df.loc[last_index, 'MA10'] > pandas_df.loc[last_index, 'MA20'],
        pandas_df.loc[last_index, 'MA10'] > pandas_df.loc[last_index, 'MA50'],
        pandas_df.loc[last_index, 'RSI'] < 20,
        pandas_df.loc[last_index, 'MACD'] > pandas_df.loc[last_index, 'Signal'],
        pandas_df.loc[last_index, 'close'] < pandas_df.loc[last_index, 'lower_BB'],
        pandas_df.loc[last_index, 'MFI'] < 20,
        pandas_df.loc[last_index, 'volume'] > pandas_df.loc[last_index, 'volume_avg']
    ]

    sell_criteria = [
        pandas_df.loc[last_index, 'MA10'] < pandas_df.loc[last_index, 'MA20'],
        pandas_df.loc[last_index, 'MA10'] < pandas_df.loc[last_index, 'MA50'],
        pandas_df.loc[last_index, 'RSI'] > 80,
        pandas_df.loc[last_index, 'MACD'] < pandas_df.loc[last_index, 'Signal'],
        pandas_df.loc[last_index, 'close'] > pandas_df.loc[last_index, 'Upper_BB'],
        pandas_df.loc[last_index, 'MFI'] > 80,
        pandas_df.loc[last_index, 'volume'] < pandas_df.loc[last_index, 'volume_avg']
    ]

    hold_criteria = [
        pandas_df.loc[last_index, 'MA10'] == pandas_df.loc[last_index, 'MA20'],  # MA10 giao cắt ngang MA20
        pandas_df.loc[last_index, 'RSI'] > 30 and pandas_df.loc[last_index, 'RSI'] < 70,  # RSI ở mức trung tính
        pandas_df.loc[last_index, 'MACD'] == pandas_df.loc[last_index, 'Signal'],  # MACD không có chênh lệch
        pandas_df.loc[last_index, 'close'] > pandas_df.loc[last_index, 'lower_BB'] and pandas_df.loc[last_index, 'close'] < pandas_df.loc[last_index, 'Upper_BB'],  # Giá nằm trong Bollinger Bands
        pandas_df.loc[last_index, 'MFI'] > 30 and pandas_df.loc[last_index, 'MFI'] < 70,  # MFI ở mức trung bình
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
    return signal       