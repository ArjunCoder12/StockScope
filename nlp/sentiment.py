# nlp/sentiment.py

import random

class SentimentAnalyzer:
    def analyze_sentiment(ticker: str) -> dict:
        """
        Dummy sentiment analysis function.
        Currently returns equal distribution for positive, neutral, and negative.

        """

        #validate the ticker if not uppercase
        if not ticker.isalpha():
            raise ValueError("Invalid ticker symbol")
        
        #probability of each of the market situations

        weights = random.choice([
            {"positive": 0.60, "neutral": 0.25, "negative": 0.15},  # prices expected to rise
            {"positive": 0.30, "neutral": 0.50, "negative": 0.20},  # no mood
            {"positive": 0.15, "neutral": 0.35, "negative": 0.50},  # prices expected to fall
        ])

        #mock headlines seen in financial news
        headlines = [
            f"{ticker.upper()} shares rise amid market optimism",
            f"Analysts comment on {ticker.upper()} performance",
            f"Investors react negatively to {ticker.upper()} news",
        ]



        return {
            "positive": 0.33,
            "neutral": 0.33,
            "negative": 0.33
        }


    if __name__ == "__main__":
        ticker = "AAPL"
        result = analyze_sentiment(ticker)
        print(f"Sentiment for {ticker}: {result}")
