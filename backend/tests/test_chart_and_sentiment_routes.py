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


def test_chart_success(client):
    with patch("app.routes.chart.get_price_data", return_value=sample_series()):
        r = client.get("/api/v1/charting/AAPL")
        assert r.status_code == 200
        js = r.get_json()
        assert js["status"] == "success"
        assert isinstance(js["data"], list)
        assert js["data"] and {"date", "price", "open", "high", "low", "close", "volume"} <= set(js["data"][0].keys())


def test_chart_no_data(client):
    with patch("app.routes.chart.get_price_data", return_value={}):
        r = client.get("/api/v1/charting/AAPL")
        assert r.status_code == 404


def test_sentiment_invalid_len(client):
    r = client.get("/api/v1/sentiment/TOOLONG")
    assert r.status_code == 400


def test_sentiment_non_alpha(client):
    r = client.get("/api/v1/sentiment/AAPL1")
    assert r.status_code == 400


def test_indicators_success(client):
    """Test the unified indicators endpoint returns all required fields"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    with patch("app.routes.chart.get_price_data", return_value=sample_series_extended()):
        r = client.get("/api/v1/charting/AAPL/indicators")
        assert r.status_code == 200
        js = r.get_json()
        
        # Should return a list directly (not wrapped in status/data)
        assert isinstance(js, list)
        assert len(js) > 0
        
        # Check that we have data after initial NaN values are dropped
        # Should have at least some rows where all indicators are calculated
        if len(js) > 0:
            first = js[0]
            required_fields = {
                "timestamp", "close", "ema12", "ema26", "macd", "signal",
                "histogram", "rsi", "sma20", "upperBand", "lowerBand"
            }
            assert required_fields <= set(first.keys())
            
            # Check timestamp format (ISO format)
            assert "T" in first["timestamp"]
            assert first["timestamp"].endswith("Z")
            
            # Check all numeric values are floats
            assert isinstance(first["close"], (int, float))
            assert isinstance(first["ema12"], (int, float))
            assert isinstance(first["ema26"], (int, float))
            assert isinstance(first["macd"], (int, float))
            assert isinstance(first["signal"], (int, float))
            assert isinstance(first["histogram"], (int, float))
            assert isinstance(first["rsi"], (int, float))
            assert isinstance(first["sma20"], (int, float))
            assert isinstance(first["upperBand"], (int, float))
            assert isinstance(first["lowerBand"], (int, float))


def test_indicators_no_data(client):
    """Test indicators endpoint when no data is available"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    with patch("app.routes.chart.get_price_data", return_value={}):
        r = client.get("/api/v1/charting/AAPL/indicators")
        assert r.status_code == 404
        js = r.get_json()
        assert js["status"] == "error"
        assert "No data found" in js["message"]


def test_indicators_insufficient_data(client):
    """Test indicators endpoint with insufficient data for calculations"""
    stocks = importlib.import_module("app.routes.stocks")
    if hasattr(stocks, "_CACHE"):
        stocks._CACHE.clear()
    
    # Only 5 days of data - not enough for any indicators
    small_series = {f"2025-01-{i+1:02d}": {
        "1. open": "100",
        "2. high": "110",
        "3. low": "90",
        "4. close": "105",
        "5. volume": "1000",
    } for i in range(5)}
    
    with patch("app.routes.chart.get_price_data", return_value=small_series):
        r = client.get("/api/v1/charting/AAPL/indicators")
        assert r.status_code == 200
        js = r.get_json()
        # Should return empty list since indicators can't be calculated
        assert isinstance(js, list)
        assert len(js) == 0

