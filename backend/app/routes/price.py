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
    if ticker in mock_prices:
        return jsonify({"status": "success", "data": mock_prices[ticker]}), 200
    else:
        return jsonify({"status": "error", "message": f"No data for ticker {mock_prices[ticker]}"}), 404