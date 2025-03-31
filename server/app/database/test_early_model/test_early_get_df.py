import pytest
import pandas as pd
from unittest.mock import patch, MagicMock
from server.app.database.model import DbModel

@pytest.mark.describe("DbModel.get_df")
class TestGetDf:
    
    @pytest.mark.happy_path
    def test_get_df_default_parameters(self):
        """Test get_df with default parameters to ensure it returns a DataFrame with expected columns."""
        model = DbModel()
        with patch('server.app.database.model.Vnstock') as MockVnstock:
            mock_stock = MagicMock()
            mock_stock.quote.history.return_value = pd.DataFrame({
                'time': pd.date_range(start='2020-01-01', periods=5, freq='D'),
                'open': [1, 2, 3, 4, 5],
                'high': [2, 3, 4, 5, 6],
                'low': [0, 1, 2, 3, 4],
                'close': [1.5, 2.5, 3.5, 4.5, 5.5],
                'volume': [100, 200, 300, 400, 500]
            })
            MockVnstock.return_value.stock.return_value = mock_stock
            
            df = model.get_df()
            assert list(df.columns) == ['Open', 'High', 'Low', 'Close', 'Volume', 'Date']
            assert len(df) == 5

    @pytest.mark.happy_path
    def test_get_df_custom_parameters(self):
        """Test get_df with custom parameters to ensure it returns a DataFrame with expected data."""
        model = DbModel()
        with patch('server.app.database.model.Vnstock') as MockVnstock:
            mock_stock = MagicMock()
            mock_stock.quote.history.return_value = pd.DataFrame({
                'time': pd.date_range(start='2021-01-01', periods=3, freq='D'),
                'open': [10, 20, 30],
                'high': [15, 25, 35],
                'low': [5, 15, 25],
                'close': [12, 22, 32],
                'volume': [1000, 2000, 3000]
            })
            MockVnstock.return_value.stock.return_value = mock_stock
            
            df = model.get_df(RIC='bbb', start_date='2021-01-01', end_date='2021-01-03', interval='1D')
            assert len(df) == 3
            assert df['Open'].iloc[0] == 10000  # 10 * 1000

    @pytest.mark.edge_case
    def test_get_df_no_data(self):
        """Test get_df when no data is returned to ensure it handles empty DataFrame gracefully."""
        model = DbModel()
        with patch('server.app.database.model.Vnstock') as MockVnstock:
            mock_stock = MagicMock()
            mock_stock.quote.history.return_value = pd.DataFrame(columns=['time', 'open', 'high', 'low', 'close', 'volume'])
            MockVnstock.return_value.stock.return_value = mock_stock
            
            df = model.get_df(RIC='ccc', start_date='2030-01-01', end_date='2030-01-03', interval='1D')
            assert df.empty

    @pytest.mark.edge_case
    def test_get_df_invalid_date_format(self):
        """Test get_df with invalid date format to ensure it raises an appropriate error."""
        model = DbModel()
        with pytest.raises(ValueError):
            model.get_df(start_date='invalid-date', end_date='2025-01-01')

    @pytest.mark.edge_case
    def test_get_df_invalid_interval(self):
        """Test get_df with an invalid interval to ensure it raises an appropriate error."""
        model = DbModel()
        with patch('server.app.database.model.Vnstock') as MockVnstock:
            mock_stock = MagicMock()
            mock_stock.quote.history.side_effect = ValueError("Invalid interval")
            MockVnstock.return_value.stock.return_value = mock_stock
            
            with pytest.raises(ValueError, match="Invalid interval"):
                model.get_df(interval='invalid-interval')