import pytest
import pandas as pd
from app.utils.business import get_company_detail

@pytest.mark.describe("Unit tests for get_company_detail function")
class TestGetCompanyDetail:

    @pytest.mark.happy_path
    def test_happy_path_with_complete_data(self):
        """
        Test that get_company_detail returns correct details when all expected data is present.
        """
        data = {
            'website': pd.Series(['https://example.com']),
            'short_name': pd.Series(['ExampleCo'])
        }
        df = pd.DataFrame(data)
        result = get_company_detail(df)
        expected = {
            'address': 'Viet Nam',
            'phone_number': '028 7308 8888',
            'website': 'https://example.com',
            'company_short_name': 'ExampleCo'
        }
        assert result == expected

    @pytest.mark.happy_path
    def test_happy_path_with_missing_optional_data(self):
        """
        Test that get_company_detail returns 'N/A' for missing optional fields.
        """
        data = {}
        df = pd.DataFrame(data)
        result = get_company_detail(df)
        expected = {
            'address': 'Viet Nam',
            'phone_number': '028 7308 8888',
            'website': 'N/A',
            'company_short_name': 'N/A'
        }
        assert result == expected

    @pytest.mark.edge_case
    def test_edge_case_with_empty_dataframe(self):
        """
        Test that get_company_detail handles an empty DataFrame gracefully.
        """
        df = pd.DataFrame()
        result = get_company_detail(df)
        expected = {
            'address': 'Viet Nam',
            'phone_number': '028 7308 8888',
            'website': 'N/A',
            'company_short_name': 'N/A'
        }
        assert result == expected

    @pytest.mark.edge_case
    def test_edge_case_with_multiple_entries(self):
        """
        Test that get_company_detail returns the last entry for fields with multiple values.
        """
        data = {
            'website': pd.Series(['https://example1.com', 'https://example2.com']),
            'short_name': pd.Series(['Example1', 'Example2'])
        }
        df = pd.DataFrame(data)
        result = get_company_detail(df)
        expected = {
            'address': 'Viet Nam',
            'phone_number': '028 7308 8888',
            'website': 'https://example2.com',
            'company_short_name': 'Example2'
        }
        assert result == expected

    @pytest.mark.edge_case
    def test_edge_case_with_non_string_data(self):
        """
        Test that get_company_detail handles non-string data types gracefully.
        """
        data = {
            'website': pd.Series([12345]),
            'short_name': pd.Series([67890])
        }
        df = pd.DataFrame(data)
        result = get_company_detail(df)
        expected = {
            'address': 'Viet Nam',
            'phone_number': '028 7308 8888',
            'website': 12345,
            'company_short_name': 67890
        }
        assert result == expected