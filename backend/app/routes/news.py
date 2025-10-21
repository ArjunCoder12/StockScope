from flask import Blueprint, jsonify
from datetime import datetime, timezone
import yfinance as yf
import time 

news_bp = Blueprint("news", __name__)

_NEWS_CACHE = {} 
_NEWS_TTL = 300

def _get_news_cached(ticker):
    now = time.time()
    entry = _NEWS_CACHE.get(ticker)
    if entry and (now - entry["ts"]) < _NEWS_TTL:
        return entry["data"]
    return None

def _set_news_cache(ticker, data):
    _NEWS_CACHE[ticker] = {"ts": time.time(), "data": data}
def _format_article(ticker, item):
    title = item.get("title") or ""
    url = item.get("link") or item.get("url") or ""
    description = item.get("summary") or item.get("description") or item.get("content") or ""

    placeholder_img = "https://placehold.co/600x400"
    image = placeholder_img
    thumb = item.get("thumbnail") or {}
    resolutions = thumb.get("resolutions") or []
    if isinstance(resolutions, list) and resolutions:
        try:
            image = (
                sorted(
                    resolutions,
                    key=lambda r: r.get("width", 0) * r.get("height", 0)
                )[-1].get("url")
                or placeholder_img
            )
        except Exception:
            image = placeholder_img
    ts = item.get("published") or item.get("pubDate") or item.get("isoDate") or item.get("providerPublishTime") or item.get("pubDate") or item.get("published_at")
    if isinstance(ts, int) or isinstance(ts, float):
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
    elif isinstance(ts, str):
        try:
            dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        except Exception:
            dt = datetime.now(timezone.utc)
    else:
        dt = datetime.now(timezone.utc)
    return {
        "ticker": ticker,
        "title": title,
        "description": description,
        "url": url,
        "image": image or placeholder_img,
        "lastUpdated": dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

@news_bp.route("/news/<ticker>", methods=["GET"])
def get_news(ticker):
    ticker = (ticker or "").upper()
    if len(ticker) < 1 or len(ticker) > 5:
        return jsonify({"status": "error", "data": [], "message": "Ticker must be 1–5 characters long."}), 400
    if not ticker.isalpha():
        return jsonify({"status": "error", "data": [], "message": "Ticker must contain letters only."}), 400

    try:
        cached = _get_news_cached(ticker)
        if cached is not None:
            return jsonify({"status": "success", "data": cached}), 200

        if yf is None:
            return jsonify({
                "status": "error",
                "data": [],
                "message": "yfinance is not installed on the server"
            }), 500

        tk = yf.Ticker(ticker)
        raw_news = getattr(tk, "news", None) or []
        if not isinstance(raw_news, list) or not raw_news:
            return jsonify({"status": "success", "data": []}), 200

        formatted = [_format_article(ticker, item) for item in raw_news]
        formatted.sort(key=lambda x: x["lastUpdated"], reverse=True)
        formatted = formatted[:4]

        _set_news_cache(ticker, formatted)
        return jsonify({"status": "success", "data": formatted}), 200

    except Exception as e:
        return jsonify({"status": "error", "data": [], "message": str(e)}), 500

