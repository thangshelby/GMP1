import pandas as pd
import numpy as np

# Tạo DataFrame với 10 hàng và 5 cột, một số ô chứa giá trị NaN
financial_data = pd.DataFrame({
    'Revenue':    [1000, 1500, np.nan, 1700, 2000, 1800, np.nan, 1600, 2100, 1900],
    'Expenses':   [800, 950, 1000, np.nan, 1100, 1050, 990, np.nan, 1150, 1080],
    'Profit':     [200, 550, np.nan, 700, 900, 750, np.nan, 600, 950, 820],
    'Assets':     [5000, np.nan, 5100, 5300, np.nan, 5500, 5400, 5200, np.nan, 5600],
    'Liabilities':[3000, 3200, np.nan, 3100, 3300, np.nan, 3400, 3150, 3350, np.nan]
})


financial_data.to_csv('', index=False)
