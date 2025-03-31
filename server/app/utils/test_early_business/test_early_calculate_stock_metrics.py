import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
import pandas as pd
import numpy as np
from server.app.utils.business import calculate_stock_metrics

# Mock data for stock and finance data
mock_stock_data = pd.DataFrame({
    'time': pd.date_range(start='2023-01-01', periods=10, freq='D'),
    'high': np.random.rand(10) * 100,
    'low': np.random.rand(10) * 100,
    'close': np.random.rand(10) * 100,
    'volume': np.random.randint(1000, 5000, size=10)
})

mock_finance_data = pd.DataFrame({
    ('Meta', 'ticker'): ['ABC'],
    ('Meta', 'yearReport'): [2023],
    ('Meta', 'lengthReport'): [1],
    ('Chỉ tiêu định giá', 'Outstanding Share (Mil. Shares)'): [100],
    ('Chỉ tiêu định giá', 'P/E'): [15],
    ('Chỉ tiêu khả năng sinh lợi', 'Dividend yield (%)'): [2.5]
})

@pytest.fixture
def mock_get_stock_data():
    with patch('server.app.utils.business.get_stock_data') as mock:
        mock.return_value = (mock_stock_data, MagicMock())
        yield mock

@pytest.fixture
def mock_get_finance_data():
    with patch('server.app.utils.business.get_finance_data') as mock:
        mock.return_value = (100, 15, 2.5)
        yield mock

@pytest.mark.describe("Tests for calculate_stock_metrics")
class TestCalculateStockMetrics:

    @pytest.mark.happy_path
    def test_calculate_stock_metrics_happy_path(self, mock_get_stock_data, mock_get_finance_data):
        """
        Test calculate_stock_metrics under normal conditions with valid data.
        """
        result = calculate_stock_metrics('ABC', datetime(2023, 1, 10))
        assert result is not None
        assert result['symbol'] == 'ABC'
        assert result['share_detail']['52_wk_high'] is not None
        assert result['share_detail']['52_wk_low'] is not None

    @pytest.mark.edge_case
    def test_calculate_stock_metrics_no_stock_data(self, mock_get_finance_data):
        """
        Test calculate_stock_metrics when no stock data is returned.
        """
        with patch('server.app.utils.business.get_stock_data') as mock:
            mock.return_value = (None, None)
            result = calculate_stock_metrics('ABC', datetime(2023, 1, 10))
            assert result is None

    @pytest.mark.edge_case
    def test_calculate_stock_metrics_empty_stock_data(self, mock_get_finance_data):
        """
        Test calculate_stock_metrics when stock data is empty.
        """
        with patch('server.app.utils.business.get_stock_data') as mock:
            mock.return_value = (pd.DataFrame(), None)
            result = calculate_stock_metrics('ABC', datetime(2023, 1, 10))
            assert result is None

    @pytest.mark.edge_case
    def test_calculate_stock_metrics_no_finance_data(self, mock_get_stock_data):
        """
        Test calculate_stock_metrics when no finance data is available.
        """
        with patch('server.app.utils.business.get_finance_data') as mock:
            mock.return_value = (np.nan, np.nan, np.nan)
            result = calculate_stock_metrics('ABC', datetime(2023, 1, 10))
            assert result is not None
            assert result['ratio']['pe_ttm'] == 0
            assert result['ratio']['dividend_yield'] == 0

    @pytest.mark.edge_case
    def test_calculate_stock_metrics_date_out_of_range(self, mock_get_stock_data, mock_get_finance_data):
        """
        Test calculate_stock_metrics when the date is out of the stock data range.
        """
        result = calculate_stock_metrics('ABC', datetime(2025, 1, 10))
        assert result is None

    @pytest.mark.edge_case
    def test_calculate_stock_metrics_insufficient_data_for_percentage_change(self, mock_get_stock_data, mock_get_finance_data):
        """
        Test calculate_stock_metrics when there is insufficient data for percentage change calculations.
        """
        short_data = mock_stock_data.head(2)
        with patch('server.app.utils.business.get_stock_data') as mock:
            mock.return_value = (short_data, MagicMock())
            result = calculate_stock_metrics('ABC', datetime(2023, 1, 2))
            assert result is not None
            assert np.isnan(result['percentage_change']['5_day'])