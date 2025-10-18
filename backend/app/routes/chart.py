from flask import Blueprint, jsonify
from ..fetchers import get_price_data
from datetime import datetime

chart_bp = Blueprint("chart", __name__)

@chart_bp.route("/charting/<ticker>", methods = ["GET"])
def get_char_data(ticker):
    ticker = ticker.upper()
    try:
        data = get_price_data(ticker, "daily")
        if not data:
            return jsonify({"status": "error", "data": [], "message": f"No data found for {ticker}"}), 404
        chart_data = []
        for date_str, values in data.items():
            chart_data.append({
                "date": datetime.strptime(date_str, "%Y-%m-%d").strftime("%b %d"),
                #%Y-%m-%d: 2025 - 10 - 17 (string parse time)
                #%b %d: Oct 17 (strong format time)

                "price": round(float(values["4. close"]), 2),  # closing price
                "open": round(float(values["1. open"]), 2),
                "high": round(float(values["2. high"]), 2),
                "low": round(float(values["3. low"]), 2),
                "close": round(float(values["4. close"]), 2),
                "volume": int(values["5. volume"])
            })
        chart_data = sorted(chart_data, key=lambda x: datetime.strptime(x["date"], "%b %d"))
        #sort by time unformatted with year => good for time with multiple years

        return jsonify({"status": "success", "data": chart_data}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "data": [], "message": str(e)}), 500