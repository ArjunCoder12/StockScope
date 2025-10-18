import os
import requests
from dotenv import load_dotenv

load_dotenv()
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

BASE_URL = "https://www.alphavantage.co/query"

def get_price_data(ticker, timeframe = "daily", interval = "5min"):
    function_map = {
        "daily": "TIME_SERIES_DAILY",
        "weekly": "TIME_SERIES_WEEKLY",
        "monthly": "TIME_SERIES_MONTHLY",
        "intraday": "TIME_SERIES_INTRADAY"
    }
    function = function_map.get(timeframe.lower())
    if not function:
        raise ValueError("Invalid timeframe. Choose 'daily', 'weekly', or 'monthly'.")
    params = {
        "function": function,
        "symbol": ticker,
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

        # Intraday requires interval
    if timeframe.lower() == "intraday":
        if interval not in ["1min", "5min", "15min", "30min", "60min"]:
            raise ValueError("Invalid interval. Choose 1min, 5min, 15min, 30min, or 60min.")
        params["interval"] = interval
        params["outputsize"] = "compact"  # latest 100 points

    else:
        params["outputsize"] = "compact"  # latest 100 points
    
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Check for API errors or rate limit messages
        if "Error Message" in data:
            raise Exception(f"Invalid API call: {data['Error Message']}")
        if "Note" in data:
            raise Exception(f"API limit reached: {data['Note']}")
        
        # Find the time series key
        time_series_keys = [k for k in data.keys() if "Time Series" in k]
        if not time_series_keys:
            raise Exception(f"No time series data found. Response: {data}")
        
        time_series_key = time_series_keys[0]
        price_data = data[time_series_key]
        return price_data

    except requests.exceptions.RequestException as e:
        print(f"HTTP Request failed: {e}")
        return {}
    #Network is down, wrong URL, Timeout, 404, 500

    except Exception as e:
        print(f"Error fetching data: {e}")
        return {}
    #JSON parsing fail, key not found in dictionary, ValueError from input
