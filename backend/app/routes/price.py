from flask import Blueprint, jsonify
from app.fetchers import get_price_data


price_bp = Blueprint("price", __name__)

mock_prices = {
    "AAPL": {"ticker": "AAPL", "price": 1234.56, "currency": "USD"},
    "TSLA": {"ticker": "TSLA", "price": 6789.9, "currency": "USD"},
    "GOOGL": {"ticker": "GOOGL", "price": 2808.07, "currency": "USD"}
}

@price_bp.route("/price/<ticker>", methods = ["GET"])
def get_price(ticker):
    ticker = ticker.upper()
    if len(ticker) < 1 or len(ticker) > 5:
        return jsonify({"status": "error", "message": f"Ticker must be 1–5 characters long."}), 400
    elif not ticker.isalpha():
        return jsonify({"status": "error", "message": f"Ticker must contain letters only."}), 400
    try:
        data = get_price_data(ticker, "daily")
        if not data:
            return jsonify({
                    "status": "error",
                    "message": f"No data found for {ticker}"
                }), 404
        latest_date = sorted(data.keys(), reverse=True)[0]
        latest_info = data[latest_date]
        formatted = {
            "ticker": ticker.upper(),
            "date": latest_date,
            "price": {
                "open": float(latest_info["1. open"]),
                "high": float(latest_info["2. high"]),
                "low": float(latest_info["3. low"]),
                "close": float(latest_info["4. close"]),
                "volume": int(latest_info["5. volume"])
            },
            "timeframe": "daily"
        }
        return jsonify({
            "status": "success",
            "data": formatted
            }), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    