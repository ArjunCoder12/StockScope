from flask import Blueprint, jsonify

fundamentals_bp = Blueprint('fundamentals', __name__)
mock_fundamentals = {
    "AAPL": {"ticker": "AAPL", "companyName": "Apple Inc.", "marketCap": "3.82T"},
    "TSLA": {"ticker": "TSLA", "companyName": "Tesla, Inc.", "marketCap": "1.45T"},
    "GOOGL": {"ticker": "GOOGL", "companyName": "Alphabet Inc.", "marketCap": "2.42T"}
}
@fundamentals_bp.route('/fundamentals/<ticker>', methods=['GET'])
def get_fundamentals(ticker):
    ticker = ticker.upper()
    if len(ticker) < 1 or len(ticker) > 5:
        return jsonify({"status": "error", "message": f"Ticker must be 1–5 characters long."}), 400
    elif not ticker.isalpha():
        return jsonify({"status": "error", "message": f"Ticker must contain letters only."}), 400
    elif (ticker in mock_fundamentals):
        return jsonify({"status": "success", "data": mock_fundamentals[ticker]}), 200
    else:
        return jsonify({"status": "error", "message": f"No data for ticker {ticker}"}), 404