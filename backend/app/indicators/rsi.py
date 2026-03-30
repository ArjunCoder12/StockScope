import pandas as pd

def calculate_rsi(prices, period=14):
    df = pd.DataFrame(prices)

    # Calculate price changes
    df["change"] = df["close"].diff()

    # Calculate gains and losses
    df["gain"] = df["change"].where(df["change"] > 0, 0)
    df["loss"] = -df["change"].where(df["change"] < 0, 0)

    # Calculate the exponential moving averages of gains and losses
    df["avg_gain"] = df["gain"].ewm(span=period, adjust=False).mean()
    df["avg_loss"] = df["loss"].ewm(span=period, adjust=False).mean()

    # Calculate RS and RSI
    df["rs"] = df["avg_gain"] / df["avg_loss"]
    df["rsi"] = 100 - (100 / (1 + df["rs"]))

    #Round
    df = df.round(2)

    return df.to_dict(orient="records")