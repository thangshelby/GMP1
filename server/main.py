from vnstock import Vnstock

stock = Vnstock().stock(symbol='VCB',source='VCI')
df= stock.quote.history(start='2000-01-01',end='2025-03-19',interval='1D')
# df = stock.quote.history(start='2024-01-01', end='2025-03-19', interval='1D')
print(df)


