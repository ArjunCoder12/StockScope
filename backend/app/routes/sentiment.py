from flask import Blueprint, jsonify
from ..fetchers import get_price_data
#.. goes one level up from the current routes/
#app.fetchers is the absolute import, and there's no app/ above routes/ in the pack

sentiment_bp = Blueprint("sentiment", __name__)

mock_sentiment = {
    "AAPL": {"ticker": "AAPL", 
             "sentiment": "positive", 
             "confidence": 0.85, 
             "description": "Strong bullish sentiment driven by positive earnings report and new product announcements. Market analysts are optimistic about growth prospects.",
             "lastUpdated": "2024-10-16T10:30:00Z"},
}

@sentiment_bp.route("/sentiment/<ticker>", methods = ["GET"])
def get_sentiment(ticker):
    ticker = ticker.upper()
    if len(ticker) < 1 or len(ticker) > 5:
        return jsonify({"status": "error", "message": f"Ticker must be 1–5 characters long."}), 400
    elif not ticker.isalpha():
        return jsonify({"status": "error", "message": f"Ticker must contain letters only."}), 400
    elif (ticker in mock_sentiment):
        return jsonify({
            "status": "success",
            "data": [mock_sentiment[ticker]]  # wrap in list for consistent format
        }), 200
    else:
        return jsonify({"status": "error", "message": f"No data for ticker {ticker}"}), 404
    