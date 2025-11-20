import sys
import os

# Add the parent directory (StockScope) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from flask import Blueprint, jsonify
from ..summary_data import fetch_summary

summary_bp = Blueprint("summary", __name__)

def validate_ticker(ticker: str):
    # Validates ticker symbol for correct formatting.
    if len(ticker) < 1 or len(ticker) > 5:
        return "Ticker must be 1–5 characters long."
    if not ticker.isalpha():
        return "Ticker must contain letters only."
    return None

@summary_bp.route("/summary/<ticker>", methods=["GET"])
def get_summary(ticker):
    ticker = ticker.upper()
    error_msg = validate_ticker(ticker)
    if error_msg:
        return jsonify({"status": "error", "message": error_msg}), 400

    try:
        result = fetch_summary(ticker)

        return jsonify({
            "status": "success",
            "ticker": ticker,
            "summary": result
        }), 200

    except Exception as e:
       return jsonify({"status": "error", "message": str(e)}), 500