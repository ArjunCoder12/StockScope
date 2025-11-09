import yfinance as yf
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from datetime import datetime, timezone
import numpy as np
import json
import os

MODEL_NAME = "ProsusAI/finbert"

class SentimentAnalyzer:
    
    def __init__(self):
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, use_safetensors = True)
            print("FinBERT model and tokenizer loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.tokenizer = None
            self.model = None

    def analyze_sentiment(self, ticker: str) -> dict:
        if not self.model or not self.tokenizer:
            return {"error": "Sentiment model is not loaded.", "ticker": ticker}

        try:
            if not ticker or not ticker.isupper():
                raise ValueError("Invalid ticker format: should be uppercase")

            stock = yf.Ticker(ticker)
            headlines_data = stock.news
            print(f"DEBUG: yfinance returned {len(headlines_data)} news items for {ticker}")
            
            if not headlines_data:
                return self.format_output(ticker, {"positive": 0.33, "neutral": 0.34, "negative": 0.33}, 
                                          "neutral", 0.5, "No recent news found for ticker.")

            headlines = []
            
            for i, item in enumerate(headlines_data[:15]):
                title = item.get('content', {}).get('title')
                
                print(f"DEBUG: Processing item {i} for {ticker}: {title}")
                
                if title:
                    headlines.append(title)
                    
            if not headlines:
                return self.format_output(ticker, {"positive": 0.33, "neutral": 0.34, "negative": 0.33}, 
                                        "neutral", 0.5, "No recent news headlines found for ticker.")

            inputs = self.tokenizer(headlines, padding=True, truncation=True, return_tensors='pt', max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
            mean_probs = probs.mean(dim=0).numpy()
            
            agg_weights = {
                "positive": float(mean_probs[0]),
                "negative": float(mean_probs[1]),
                "neutral": float(mean_probs[2])
            }
            
            total = sum(agg_weights.values())
            agg_weights = {k: v/total for k, v in agg_weights.items()}

            sentiment = max(agg_weights, key=agg_weights.get)
            confidence = round(agg_weights[sentiment], 2)
            
            description_map = {
                "positive": f"Strong bullish sentiment detected for {ticker}. Recent news headlines are broadly positive, focusing on growth, earnings beats, or positive analyst ratings.",
                "neutral": f"Mixed or neutral sentiment for {ticker}. News flow appears balanced or lacks significant market-moving events, leading to a wait-and-see outlook.",
                "negative": f"Bearish sentiment detected for {ticker}. Recent headlines may be focused on poor earnings, regulatory challenges, or analyst downgrades.",
            }
            description = description_map[sentiment]

            return self.format_output(ticker, agg_weights, sentiment, confidence, description)

        except ValueError as e:
            return {"status": "error", "message": str(e), "ticker": ticker}
        except Exception as e:
            return {"status": "error","message": f"Unexpected error: {e}", "ticker": ticker}

    def format_output(self, ticker, weights, sentiment, confidence, description):
        return {
            "status": "success",
            "data": [
                {
                    "ticker": ticker,
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "aggregate_scores": weights,
                    "description": description,
                    "lastUpdated": datetime.now(timezone.utc).isoformat()
                }
            ]
        }

if __name__ == "__main__":
    
    analyzer = SentimentAnalyzer()
    
    tickers_to_analyze = ["AAPL", "TSLA", "MRK", "TTWO"]
    
    folder_name = datetime.now().strftime("%Y-%m-%d_sentiments")

    try:
        os.makedirs(folder_name, exist_ok=True)
        print(f"DEBUG: Using directory '{folder_name}' for results.")
    except Exception as e:
        print(f"Could not create directory '{folder_name}'. Error: {e}")
        exit()

    for ticker in tickers_to_analyze:
        print(f"\n--- Analyzing {ticker} ---")
        sentiment_data = analyzer.analyze_sentiment(ticker)
        
        print(f"--- Results for {ticker} ---")
        print(sentiment_data)
        
        filename = f"{ticker}_sentiment.json"
        
        full_path = os.path.join(folder_name, filename)
        
        try:
            with open(full_path, 'w') as f:
                json.dump(sentiment_data, f, indent=4)
            print(f"Successfully saved results to {full_path}")
        except Exception as e:
            print(f"Error saving file to {full_path}: {e}")