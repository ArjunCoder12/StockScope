from flask import Blueprint, jsonify
from ..fetchers import get_price_data
#.. goes one level up from the current routes/
#app.fetchers is the absolute import, and there's no app/ above routes/ in the pack

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
        data = get_price_data(ticker, "daily") or mock_prices.get(ticker)
        if not data:
            return jsonify({
                    "status": "error",
                    "message": f"No data found for {ticker}"
                }), 404
        return jsonify(data)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    