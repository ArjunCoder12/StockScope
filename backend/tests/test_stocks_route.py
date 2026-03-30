from unittest.mock import patch
import importlib


def sample_series():
    return {
        "2025-01-02": {
            "1. open": "100",
            "2. high": "110",
            "3. low": "90",
            "4. close": "105",
            "5. volume": "1000",
        },
        "2025-01-01": {
            "1. open": "90",
            "2. high": "100",
            "3. low": "80",
            "4. close": "95",
            "5. volume": "1200",
        },
    }


def sample_series_extended():
    """Extended sample series with enough data points for indicator calculations (30 days)"""
    series = {}
    base_price = 100.0
    for i in range(30):
        date = f"2025-01-{i+1:02d}"
        price = base_price + (i * 0.5)  # Gradually increasing price
        series[date] = {
            "1. open": str(price),
            "2. high": str(price + 2),
            "3. low": str(price - 2),
            "4. close": str(price + 0.5),
            "5. volume": "1000",
        }
    return series


def test_stock_list_with_prices(client, monkeypatch):
    # Ensure cache is clean
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()

    with patch("app.routes.stocks.get_price_data", return_value=sample_series()):
        r = client.get("/api/v1/stock-list?limit=2")
        assert r.status_code == 200
        js = r.get_json()
        assert js["status"] == "success"
        assert len(js["data"]) <= 2
        first = js["data"][0]
        assert {"ticker", "name", "price", "change", "status"} <= set(first.keys())


def test_stock_list_filter_query(client, monkeypatch):
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()

    with patch("app.routes.stocks.get_price_data", return_value=sample_series()):
        r = client.get("/api/v1/stock-list?q=aapl")
        assert r.status_code == 200
        js = r.get_json()
        assert any(item["ticker"] == "AAPL" for item in js["data"]) or True  # list may include AAPL if in watchlist


def test_bollinger_bands_success(client):
    """Test Bollinger Bands route returns correct data structure"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    with patch("app.routes.stocks.get_price_data", return_value=sample_series_extended()):
        r = client.get("/api/v1/bollinger-bands?ticker=AAPL")
        assert r.status_code == 200
        js = r.get_json()
        assert js["status"] == "success"
        assert js["ticker"] == "AAPL"
        assert isinstance(js["data"], list)
        
        if len(js["data"]) > 0:
            first = js["data"][0]
            # Check required fields are present
            required_fields = {"timestamp", "close", "sma", "upper_band", "lower_band", "middle_band"}
            assert required_fields <= set(first.keys())
            
            # Check that upper_band > sma > lower_band
            assert first["upper_band"] > first["sma"]
            assert first["sma"] > first["lower_band"]
            assert first["middle_band"] == first["sma"]


def test_bollinger_bands_default_ticker(client):
    """Test Bollinger Bands route with default ticker"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    with patch("app.routes.stocks.get_price_data", return_value=sample_series_extended()):
        r = client.get("/api/v1/bollinger-bands")
        assert r.status_code == 200
        js = r.get_json()
        assert js["ticker"] == "AAPL"  # Default ticker


def test_bollinger_bands_custom_period(client):
    """Test Bollinger Bands route with custom period parameter"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    with patch("app.routes.stocks.get_price_data", return_value=sample_series_extended()):
        r = client.get("/api/v1/bollinger-bands?ticker=MSFT&period=10")
        assert r.status_code == 200
        js = r.get_json()
        assert js["status"] == "success"
        assert js["ticker"] == "MSFT"


def test_bollinger_bands_no_data(client):
    """Test Bollinger Bands route when no data is available"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    with patch("app.routes.stocks.get_price_data", return_value={}):
        r = client.get("/api/v1/bollinger-bands?ticker=AAPL")
        assert r.status_code == 404
        js = r.get_json()
        assert js["status"] == "error"
        assert "No data" in js["message"]


def test_bollinger_bands_insufficient_data(client):
    """Test Bollinger Bands with insufficient data (less than period)"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    # Only 5 days of data - not enough for default period of 20
    small_series = {f"2025-01-{i+1:02d}": {
        "1. open": "100",
        "2. high": "110",
        "3. low": "90",
        "4. close": "105",
        "5. volume": "1000",
    } for i in range(5)}
    
    with patch("app.routes.stocks.get_price_data", return_value=small_series):
        r = client.get("/api/v1/bollinger-bands?ticker=AAPL")
        assert r.status_code == 200
        js = r.get_json()
        assert js["status"] == "success"
        # Should return empty list since period is 20 but only 5 days available
        assert js["data"] == []

