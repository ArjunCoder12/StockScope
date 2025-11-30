import time
from app.fetchers import get_price_data
from nlp.summarizer import SentimentAnalyzer, MarketDataFetcher, GeminiSummarizer
import os
# cache to avoid repeated API calls
_CACHE = {}
_CACHE_TTL = 300
# Preload Models
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
summarizer = GeminiSummarizer(GEMINI_API_KEY) if GEMINI_API_KEY else None
sentiment_engine = SentimentAnalyzer()

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
        data = sentiment_engine.analyze_sentiment(ticker)
        _CACHE[key] = {"ts": now, "data": data}
        return data
    except Exception as e:
        print(f"Error fetching news sentiment: {e}")
        return []
    
def fetch_news_summary(ticker): 
    key = f"news_sum_{ticker}"
    now = time.time()
    if key in _CACHE and now - _CACHE[key]["ts"] < _CACHE_TTL:
        return _CACHE[key]["data"]
    if not summarizer:
        return {"error": "Gemini summarizer not configured"}
    try:
        fundamentals = MarketDataFetcher.get_fundamentals(ticker) or {}
        sentiment_data = fetch_news_sentiment(ticker)
        result = summarizer.generate_card(
            ticker=ticker,
            sentiment_data=sentiment_data,        
            fundamentals=fundamentals,          
            user_profile="General Investor"
        )
        _CACHE[key] = {"ts": now, "data": result}
        return result
    except Exception as e:
        print(f"Error fetching Gemini summary {ticker}: {e}")
        return []
    
    
def fetch_summary(ticker):
    company_info = fetch_company_info(ticker)

    price_history_dict = fetch_price_history(ticker)
    price_history_list = [
        {"date": date, "close": float(values["4. close"])}
        for date, values in price_history_dict.items()
    ]
    price_history_list.sort(key = lambda x: x["date"])
    chart_snapshot = {}

    try:
        # price_history[-1] means the last entry, check if price history exist and it has close price
        if price_history_list:
            first = price_history_list[0]["close"] #oldest closing price
            last = price_history_list[-1]["close"] #latest closing price
            chart_snapshot = {
                "latest_price": last,
                "first_price": first,
                "change_pct": round((last - first) / first * 100, 2)
            }
    except Exception:
        chart_snapshot = {}

    news_sentiment = fetch_news_sentiment(ticker)

    news_summary = fetch_news_summary(ticker)

    return {
        "ticker": ticker,
        "price_history": price_history_list,
        "company_info": company_info,
        "news_sentiment": news_sentiment,
        "news_summary": news_summary,
        "chart_snapshot": chart_snapshot
    }