from flask import Blueprint, jsonify

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
    elif (ticker in mock_prices):
        return jsonify({"status": "success", "data": mock_prices[ticker]}), 200
    else:
        return jsonify({"status": "error", "message": f"No data for ticker {ticker}"}), 404