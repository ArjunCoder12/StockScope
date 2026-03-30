# nlp/sentiment.py

import random
from datetime import datetime, timezone

class SentimentAnalyzer:
    def analyze_sentiment(ticker: str) -> dict:
        """
        Dummy sentiment analysis function.
        Currently returns equal distribution for positive, neutral, and negative.

        """
        try:
            # validate ticket
            if not ticker:
                raise ValueError("Ticker cannot be empty")

            # A more flexible check: ensures it's uppercase and has no lowercase
            if not ticker.isupper():
                raise ValueError("Invalid ticker format: should be uppercase")
            
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

            # dummy sentiment & description values
            sentiment = max(weights, key=weights.get)
            description_map = {
                "positive": f"Strong bullish sentiment driven by positive earnings report and new product announcements. Market analysts are optimistic about {ticker}'s growth prospects.",
                "neutral": f"Mixed or unclear signals surrounding {ticker}. Analysts are taking a wait-and-see approach.",
                "negative": f"Bearish sentiment as {ticker} faces headwinds and disappointing performance reports. Investors remain cautious.",
            }
            description = description_map[sentiment]

            #fake confidence check, how sure we are about the sentiment 
            confidence = round(max(weights.values()) + random.uniform(0.0, 0.1), 2)

            last_updated = datetime.now(timezone.utc).isoformat()

            #json like output
            # return {
            #     "ticker": ticker.upper(),
            #     "aggregate": weights,
            #     "headlines": headlines,
            #     "confidence": confidence
            # }
            return {
                    "status": "success",
                    "data": [
                        {
                            "ticker": ticker,
                            "sentiment": sentiment,
                            "confidence": confidence,
                            "description": description,
                            "lastUpdated": last_updated
                        }
                    ]
            }
        except ValueError as e:
            # handle invalid input errors
            return {"error": str(e), "ticker": ticker}

        except Exception as e:
            # catch-all for unexpected errors
            return {"error": f"Unexpected error: {e}", "ticker": ticker}
        


if __name__ == "__main__":
    print(SentimentAnalyzer.analyze_sentiment("AAPL"))

"""
Example of the output: 
{'ticker': 'AAPL', 'aggregate': {'positive': 0.3, 'neutral': 0.5, 'negative': 0.2}, 'headlines': ['AAPL shares rise amid market optimism', 'Analysts comment on AAPL performance', 'Investors react negatively to AAPL news'], 'confidence': 0.58}"""