from flask import Blueprint, jsonify
from ..fetchers import get_price_data
from datetime import datetime
from ..indicators.macd import calculate_macd
from ..indicators.rsi import calculate_rsi
from ..indicators.bollingerbands import calculate_bollinger_bands
import pandas as pd

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

@chart_bp.route("/charting/<ticker>/indicators", methods=["GET"])
def get_indicators(ticker):
    ticker = ticker.upper()
    try:
        data = get_price_data(ticker, "daily")
        if not data:
            return jsonify({"status": "error", "data": [], "message": f"No data found for {ticker}"}), 404
        
     
        prices = [
            {"timestamp": date, "close": float(values["4. close"])}
            for date, values in data.items()
        ]
        prices.sort(key=lambda x: x["timestamp"])
    
        macd_data = calculate_macd(prices)
        rsi_data = calculate_rsi(prices)
        bb_data = calculate_bollinger_bands(prices, period=20)
        
  
        df_prices = pd.DataFrame(prices)
        df_macd = pd.DataFrame(macd_data)
        df_rsi = pd.DataFrame(rsi_data)
        df_bb = pd.DataFrame(bb_data)
      
        df_result = df_prices.copy()
        

        if not df_macd.empty and "timestamp" in df_macd.columns:
            df_result = df_result.merge(df_macd[["timestamp", "ema12", "ema26", "macd", "signal", "histogram"]], 
                                        on="timestamp", how="left")
        else:
           
            for col in ["ema12", "ema26", "macd", "signal", "histogram"]:
                df_result[col] = None
        

        if not df_rsi.empty and "timestamp" in df_rsi.columns:
            df_result = df_result.merge(df_rsi[["timestamp", "rsi"]], 
                                        on="timestamp", how="left")
        else:
            df_result["rsi"] = None
        
      
        if not df_bb.empty and "timestamp" in df_bb.columns:
            df_result = df_result.merge(df_bb[["timestamp", "sma", "upper_band", "lower_band"]], 
                                        on="timestamp", how="left")
        else:
        
            for col in ["sma", "upper_band", "lower_band"]:
                df_result[col] = None
  
        df_result = df_result.dropna()
        

        if df_result.empty:
            return jsonify([]), 200
        
       
        df_result = df_result.rename(columns={
            "sma": "sma20",
            "upper_band": "upperBand",
            "lower_band": "lowerBand"
        })
        
        
        df_result["timestamp"] = pd.to_datetime(df_result["timestamp"], format="%Y-%m-%d").dt.strftime("%Y-%m-%dT%H:%M:%SZ")
        
    
        numeric_columns = df_result.select_dtypes(include=["float64"]).columns
        df_result[numeric_columns] = df_result[numeric_columns].round(2)
        
    
        result_columns = ["timestamp", "close", "ema12", "ema26", "macd", "signal", 
                         "histogram", "rsi", "sma20", "upperBand", "lowerBand"]
        
        
        df_result = df_result.reindex(columns=result_columns)
        
    
        indicators_data = df_result.to_dict(orient="records")
        
        return jsonify(indicators_data), 200
    
    except Exception as e:
        return jsonify({"status": "error", "data": [], "message": str(e)}), 500