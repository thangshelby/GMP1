import os

import polars as pl

from app.constant.constant import hnx, hose, upcom

print(len(hose)+len(hnx))
hnx_files_count = len(os.listdir('./app/data/hnx'))
print(f"Number of files in hnx folder: {hnx_files_count}")
hose_files_count = len(os.listdir('./app/data/hose'))
print(f"Number of files in hose folder: {hose_files_count}")

# for symbol in hose:
#     try:
#         df = pl.read_csv(f'./app/data/hose_overview/{symbol}.txt', separator='\t')
#         sub_df = pl.read_csv(f'./app/data/hose_overview_2/{symbol}.txt', separator='\t')
#         
#         # Update columns with polars syntax
#         columns_to_update = ['exchange', 'company_type', 'industry', 'no_employees', 'short_name', 'website', 'stock_rating']
#         for col in columns_to_update:
#             df = df.with_column(pl.col(col).fill_null(sub_df.select(col).to_series()))
#         
#         df.write_csv(f'./app/data/hose_final_overview/{symbol}.txt', separator='\t')
#     except Exception as e:
#         print(f'Error with {symbol}: {e}')
#         continue


