import pandas as pd

def sma(prices, period=20):
    """
    Calculate Simple Moving Average (SMA) for a given period.
    
    Args:
        prices: List of dictionaries with 'close' key, or pandas DataFrame
        period: Period for SMA calculation (default: 20)
    
    Returns:
        List of dictionaries with 'sma' field added, or DataFrame with 'sma' column
    """
    df = pd.DataFrame(prices) if not isinstance(prices, pd.DataFrame) else prices
    
    if "close" not in df.columns:
        raise ValueError("Input data must contain a 'close' column")
    
    df["sma"] = df["close"].rolling(window=period, min_periods=period).mean()
    
    if isinstance(prices, pd.DataFrame):
        return df
    else:
        return df.to_dict(orient="records")

