from vnstock import Vnstock
# from vnstock.explorer.vci import Company
# company = Company('ACB')

company= Vnstock().stock(symbol='HUT', source="VCI").company
print(company.overview())
# df= company.ratio_summary()

# print(df.columns,df)
