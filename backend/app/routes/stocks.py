import time
from flask import Blueprint, jsonify, request
from .watchlist import load_watchlist
from ..fetchers import get_price_data
import threading
from ..indicators.macd import calculate_macd
from ..indicators.rsi import calculate_rsi

# Stock list with pricing: loads persisted watchlist and enriches
# with latest price and daily change. Supports q/limit filters.

stock_list_bp = Blueprint("stocks", __name__)

@stock_list_bp.route("/stock-list", methods = ["GET"])
def get_stock_list():
    
    try:
        q = (request.args.get("q") or "").strip().lower()
        limit = int(request.args.get("limit", 25))
        limit = max(1, min(limit, 100))

        items = load_watchlist()
        if q:
            items = [s for s in items if q in s["ticker"].lower() or q in s["name"].lower()]

        out = []
        for stock in items:
            data = _get_prices_cached(stock["ticker"]) or {}
            if not data:
                continue
            dates = sorted(data.keys(), reverse=True)
            if len(dates) < 2:
                continue
            latest, prev = dates[0], dates[1]
            latest_close = float(data[latest]["4. close"])
            prev_close = float(data[prev]["4. close"])   
            out.append({
                "ticker": stock["ticker"],
                "name": stock["name"],
                "price": round(latest_close, 2),
                "change": round(latest_close - prev_close, 2),
                "status": "active",
            })
            if len(out) >= limit:
                break

        return jsonify({"status": "success", "data": out}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e), "data": []}), 500


_CACHE = {}
_CACHE_TTL = 300

def _update_cache_async(ticker):
    """Refresh ticker data in the background."""
    def task():
        try:
            data = get_price_data(ticker, "daily")
            _CACHE[ticker] = {"ts": time.time(), "data": data}
            print(f"[CACHE REFRESHED] {ticker}")
        except Exception as e:
            print(f"[CACHE ERROR] Failed to refresh {ticker}: {e}")
    threading.Thread(target=task, daemon=True).start()

@stock_list_bp.route("/macd", methods = ["GET"])
def get_macd():
    try:
        ticker = request.args.get("ticker", "AAPL").upper() #default AAPL
        data = _get_prices_cached(ticker)
        if not data:
            return jsonify({"status": "error", "message": f"No data for {ticker}"}), 404
        prices = [
            {"timestamp": date, "close": float(values["4. close"])}
            for date, values in data.items()
        ]
        prices.sort(key = lambda x: x["timestamp"]) #for each element x in the list, use x["timestamp"] to sort
        macd_data = calculate_macd(prices)
        return jsonify({"status": "success", "ticker": ticker, "data": macd_data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
@stock_list_bp.route("/rsi", methods=["GET"])
def get_rsi():
    try:
        ticker = request.args.get("ticker", "AAPL").upper()  # default AAPL
        data = _get_prices_cached(ticker)
        if not data:
            return jsonify({"status": "error", "message": f"No data for {ticker}"}), 404
        prices = [
            {"timestamp": date, "close": float(values["4. close"])}
            for date, values in data.items()
        ]
        prices.sort(key=lambda x: x["timestamp"])  #for each element x in the list, use x["timestamp"] to sort
        rsi_data = calculate_rsi(prices)

        return jsonify({"status": "success", "ticker": ticker, "data": rsi_data}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def _get_prices_cached(ticker):
    now = time.time()
    entry = _CACHE.get(ticker)

    #if cache fresh
    if entry and (now - entry["ts"]) < _CACHE_TTL:
        return entry["data"]
    
    #if cache stale but available
    if entry:
        _update_cache_async(ticker)
        return entry["data"]

    #if no cache
    data = get_price_data(ticker, "daily")
    _CACHE[ticker] = {"ts": now, "data": data}
    return data
