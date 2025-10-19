from unittest.mock import Mock, patch
import pytest

from app.fetchers import get_price_data


def make_resp(payload, status=200):
    m = Mock()
    m.status_code = status
    m.json.return_value = payload
    m.raise_for_status = Mock()
    if status >= 400:
        m.raise_for_status.side_effect = Exception("HTTP error")
    return m


def test_get_price_data_daily_success():
    payload = {
        "Meta Data": {},
        "Time Series (Daily)": {
            "2025-01-02": {
                "1. open": "100",
                "2. high": "110",
                "3. low": "90",
                "4. close": "105",
                "5. volume": "1000",
            }
        },
    }
    with patch("app.fetchers.requests.get", return_value=make_resp(payload)):
        data = get_price_data("AAPL", "daily")
        assert isinstance(data, dict)
        assert "2025-01-02" in data


def test_get_price_data_invalid_timeframe_raises():
    with pytest.raises(ValueError):
        get_price_data("AAPL", "yearly")


def test_get_price_data_intraday_bad_interval_raises():
    with pytest.raises(ValueError):
        get_price_data("AAPL", "intraday", interval="2min")


def test_get_price_data_api_error_message_returns_empty():
    payload = {"Error Message": "Invalid API call"}
    with patch("app.fetchers.requests.get", return_value=make_resp(payload)):
        data = get_price_data("AAPL", "daily")
        assert data == {}


def test_get_price_data_api_limit_note_returns_empty():
    payload = {"Note": "API limit reached"}
    with patch("app.fetchers.requests.get", return_value=make_resp(payload)):
        data = get_price_data("AAPL", "daily")
        assert data == {}


def test_get_price_data_no_time_series_returns_empty():
    payload = {"Meta Data": {}}
    with patch("app.fetchers.requests.get", return_value=make_resp(payload)):
        data = get_price_data("AAPL", "daily")
        assert data == {}


def test_get_price_data_http_error_returns_empty():
    with patch("app.fetchers.requests.get", return_value=make_resp({}, status=500)):
        data = get_price_data("AAPL", "daily")
        assert data == {}

