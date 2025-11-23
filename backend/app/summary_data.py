import time
from .fetchers import get_price_data
from nlp.summarizer import SentimentAnalyzer, MarketDataFetcher, GeminiSummarizer
# cache to avoid repeated API calls
_CACHE = {}
_CACHE_TTL = 300

def fetch_price_history(ticker):
    key = f"price_{ticker}"
    now = time.time()

    # now - _CACHE_TTL < 300 => checks if the cached data is still not older than 5 min
    if key in _CACHE and now - _CACHE[key]["ts"] < _CACHE_TTL:
        return _CACHE[key]["data"]
    
    data = get_price_data(ticker, "daily") or {}
    _CACHE[key] = {"ts": now, "data": data}
    return data

def fetch_company_info(ticker):
    key = f"company_{ticker}"
    now = time.time()

    if key in _CACHE and now - _CACHE[key]["ts"] < _CACHE_TTL:
        return _CACHE[key]["data"]
    
    try:
        # Mock data
        data = {
            "ticker": ticker,
            "name": "Example Corp",
            "industry": "Technology",
            "marketCap": 100_000_000_000,
        }
        _CACHE[key] = {"ts": now, "data": data}
        return data
    except Exception as e:
        print(f"Error fetching company info: {e}")
        return {}
    
def fetch_news_sentiment(ticker):
    key = f"news_{ticker}"
    now = time.time()

    if key in _CACHE and now - _CACHE[key]["ts"] < _CACHE_TTL:
        return _CACHE[key]["data"]

    try:
        sentiment_engine = SentimentAnalyzer()
        data = sentiment_engine.analyze_sentiment(ticker)
        _CACHE[key] = {"ts": now, "data": data}
        return data
    except Exception as e:
        print(f"Error fetching news sentiment: {e}")
        return []
def fetch_summary(ticker):
    return {
        "ticker": ticker,
        "price_history": fetch_price_history(ticker),
        "company_info": fetch_company_info(ticker),
        "news_sentiment": fetch_news_sentiment(ticker)
    }