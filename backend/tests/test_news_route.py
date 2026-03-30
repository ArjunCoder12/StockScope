from unittest.mock import patch
import os
import pytest


def make_news_item(ts, idx, with_image=True):
    item = {
        "title": f"Article {idx}",
        "link": f"https://example.com/{idx}",
        "summary": f"Summary {idx}",
        "providerPublishTime": ts,
    }
    if with_image:
        item["thumbnail"] = {
            "resolutions": [
                {"width": 100, "height": 100, "url": f"https://img/{idx}-s.jpg"},
                {"width": 600, "height": 400, "url": f"https://img/{idx}.jpg"},
            ]
        }
    return item


def test_news_success_limits_and_sort(client):
    items = [
        make_news_item(1734480000, 1, True),   
        make_news_item(1734393600, 2, False),  
        make_news_item(1734307200, 3, True),
        make_news_item(1734220800, 4, True),
        make_news_item(1734134400, 5, True),  
    ]

    class FakeTicker:
        def __init__(self, symbol):
            self.news = items

    with patch("app.routes.news.yf") as mock_yf:
        mock_yf.Ticker.side_effect = lambda s: FakeTicker(s)
        resp = client.get("/api/v1/news/AAPL")
        assert resp.status_code == 200
        js = resp.get_json()
        assert js["status"] == "success"
        data = js["data"]
        assert len(data) == 4
 
        times = [d["lastUpdated"] for d in data]
        assert times == sorted(times, reverse=True)
        
        required = {"ticker", "title", "description", "url", "image", "lastUpdated"}
        assert required.issubset(set(data[0].keys()))


def test_news_invalid_ticker_length(client):
    resp = client.get("/api/v1/news/TOOLONG")
    assert resp.status_code == 400


def test_news_non_alpha(client):
    resp = client.get("/api/v1/news/AAPL1")
    assert resp.status_code == 400


def test_news_empty_list(client):
    class FakeTicker:
        def __init__(self, symbol):
            self.news = []

    with patch("app.routes.news.yf") as mock_yf:
        mock_yf.Ticker.side_effect = lambda s: FakeTicker(s)
        resp = client.get("/api/v1/news/AAPL")
        assert resp.status_code == 200
        js = resp.get_json()
        assert js["status"] == "success"
        assert js["data"] == []


@pytest.mark.integration
def test_news_integration_yfinance_live(client):
    """Optional live test against Yahoo Finance via the Flask route.

    Skipped by default to keep tests deterministic and offline. Enable with
    RUN_YF_INTEGRATION=1 when invoking pytest.
    """
    if os.getenv("RUN_YF_INTEGRATION") != "1":
        pytest.skip("Set RUN_YF_INTEGRATION=1 to run live yfinance test")

    resp = client.get("/api/v1/news/AAPL")
    assert resp.status_code == 200
    js = resp.get_json()
    assert js["status"] == "success"
    assert isinstance(js.get("data"), list)
    assert len(js["data"]) <= 4

    if not js["data"]:
        pytest.skip("No live news returned right now; try again later")

    first = js["data"][0]
    required = {"ticker", "title", "description", "url", "image", "lastUpdated"}
    assert required.issubset(first)
    assert first["ticker"] == "AAPL"
   
    assert isinstance(first["title"], str)
    assert isinstance(first["description"], str)
    assert isinstance(first["url"], str)
    assert isinstance(first["image"], str)
    assert isinstance(first["lastUpdated"], str)
