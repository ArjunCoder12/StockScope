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

