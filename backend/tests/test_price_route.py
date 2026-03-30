from unittest.mock import patch


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


def test_price_success(client):
    with patch("app.routes.price.get_price_data", return_value=sample_series()):
        resp = client.get("/api/v1/price/AAPL")
        assert resp.status_code == 200
        js = resp.get_json()
        assert js["status"] == "success"
        assert js["data"]["ticker"] == "AAPL"
        assert "price" in js["data"]
        assert set(["open", "high", "low", "close", "volume"]).issubset(js["data"]["price"].keys())


def test_price_invalid_ticker_length(client):
    resp = client.get("/api/v1/price/TOOLONG")
    assert resp.status_code == 400


def test_price_non_alpha(client):
    resp = client.get("/api/v1/price/AAPL1")
    assert resp.status_code == 400


def test_price_no_data_found(client):
    with patch("app.routes.price.get_price_data", return_value={}):
        resp = client.get("/api/v1/price/AAPL")
        assert resp.status_code == 404


def test_price_fetcher_value_error(client):
    with patch("app.routes.price.get_price_data", side_effect=ValueError("Invalid timeframe")):
        resp = client.get("/api/v1/price/AAPL")
        assert resp.status_code == 400


def test_price_unexpected_exception(client):
    with patch("app.routes.price.get_price_data", side_effect=Exception("Boom")):
        resp = client.get("/api/v1/price/AAPL")
        assert resp.status_code == 500

