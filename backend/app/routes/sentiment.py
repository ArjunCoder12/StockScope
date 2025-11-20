import sys
import os

# Add the parent directory (Stockscope) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))
from flask import Blueprint, jsonify
from ..fetchers import get_price_data
from pathlib import Path
import sys

nlp_path = Path(__file__).resolve().parent.parent.parent.parent / "nlp"
sys.path.insert(0, str(nlp_path))

from sentiment import SentimentAnalyzer
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
        return jsonify({"status": "error", "message": f"Ticker must be 1-5 characters long."}), 400

    elif not ticker.isalpha():
        return jsonify({"status": "error", "message": f"Ticker must contain letters only."}), 400

    
    result = SentimentAnalyzer.analyze_sentiment(ticker)
    if "error" in result:
        return jsonify({"status": "error", "message": result["error"]}), 500
    
    # Result already has "status" and "data", just return it
    return jsonify(result), 200

    