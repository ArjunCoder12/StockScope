import pandas as pd

def calculate_macd(prices):
    df = pd.DataFrame(prices)
    
    df["ema12"] = df["close"].ewm(span = 12, adjust = False).mean()
    df["ema26"] = df["close"].ewm(span = 26, adjust = False).mean()

    df["macd"] = df["ema12"] - df["ema26"]

    df["signal"] = df["macd"].ewm(span = 9, adjust = False).mean()

    df["histogram"] = df["macd"] - df["signal"]

    df = df.round(2)

    return df.to_dict(orient = "records")