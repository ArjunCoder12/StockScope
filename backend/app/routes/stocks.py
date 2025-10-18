from flask import Blueprint, jsonify
from app.fetchers import get_price_data

stock_list_bp = Blueprint("stocks", __name__)

watchlist = [
    {"ticker": "AAPL", "name": "Apple Inc."},
    {"ticker": "TSLA", "name": "Tesla Inc."},
]

@stock_list_bp.route("/stocks", methods = ["GET"])
def get_stock_list():
    try:
        stock_data = []
        for stock in watchlist:
            data = get_price_data(stock["ticker"], "daily")

            if not data:
                continue

            dates = list(data.keys())
            latest_date, prev_date = dates[0], dates[1]
            latest_close = float(data[latest_date]["4. close"])
            prev_close = float(data[prev_date]["4. close"])
            change = round(latest_close - prev_close, 2)

            stock_data.append({
                "ticker": stock["ticker"],
                "name": stock["name"],
                "price": round(latest_close, 2),
                "change": change,
                "status": "active"
            })

        return jsonify({"status": "success", "data":stock_data}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "data": [], "message": str(e)}), 500