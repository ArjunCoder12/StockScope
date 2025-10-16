# nlp/sentiment.py

import random
import json

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

        #fake confidence check, how sure we are about the sentiment 
        confidence = round(max(weights.values()) + random.uniform(0.0, 0.1), 2)



        #json like output
        return {
            "ticker": ticker.upper(),
            "aggregate": weights,
            "headlines": headlines,
            "confidence": confidence
        }


if __name__ == "__main__":
    ticker = "AAPL"
    result = SentimentAnalyzer.analyze_sentiment(ticker)

    # Save result to JSON file
    with open(f"{ticker}_sentiment.json", "w") as f:
        json.dump(result, f, indent=4)

    print(f"Sentiment analysis saved to {ticker}_sentiment.json")
