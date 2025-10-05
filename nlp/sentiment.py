# nlp/sentiment.py

class SentimentAnalyzer:
    def analyze_sentiment(ticker: str) -> dict:
        """
        Dummy sentiment analysis function.
        Currently returns equal distribution for positive, neutral, and negative.

        """
        return {
            "positive": 0.33,
            "neutral": 0.33,
            "negative": 0.33
        }


    if __name__ == "__main__":
        ticker = "AAPL"
        result = analyze_sentiment(ticker)
        print(f"Sentiment for {ticker}: {result}")
