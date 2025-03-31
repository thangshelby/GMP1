import pandas_ta as ta

def analyze_stock_signal(df):
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
    return signal       