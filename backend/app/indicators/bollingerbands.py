import pandas as pd 

def calculate_bollinger_bands(prices, period=20):
    df = pd.DataFrame(prices)

    if "close" not in df.columns:
        raise ValueError("Input data must contain a 'close' column")

    df["sma"] = df["close"].rolling(window=period, min_periods = period).mean()

    df["std"] = df["close"].rolling(window=period, min_periods = period).std()

    df["upper_band"] = df["sma"] + (2 * df["std"])
    df["lower_band"] = df["sma"] - (2 * df["std"])
    df["middle_band"] = df["sma"]

    df = df.round(2)

    return df.dropna().round(2).to_dict(orient="records")
