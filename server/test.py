from vnstock import Vnstock
from vnstock.explorer.vci import Company
company = Company('ACB')

# company= Vnstock().stock(symbol='ACB', source="VCI").company

df= company.ratio_summary()

print(df.columns,df)
