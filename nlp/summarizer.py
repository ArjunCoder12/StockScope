import yfinance as yf
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timezone
import numpy as np
import json
import os
import time

load_dotenv()

SENTIMENT_MODEL_NAME = "ProsusAI/finbert"

class SentimentAnalyzer:
    def __init__(self):
        print("Loading Sentiment Model...")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(SENTIMENT_MODEL_NAME)
            self.model = AutoModelForSequenceClassification.from_pretrained(SENTIMENT_MODEL_NAME, use_safetensors=True)
            print("FinBERT model loaded successfully.")
        except Exception as e:
            print(f"Error loading sentiment model: {e}")
            self.tokenizer = None
            self.model = None

    def analyze_sentiment(self, ticker: str) -> dict:
        if not self.model or not self.tokenizer:
            return {"error": "Model not loaded"}

        try:
            stock = yf.Ticker(ticker)
            headlines_data = stock.news
            
            headlines = []
            if headlines_data:
                for item in headlines_data[:15]:
                    title = item.get('content', {}).get('title')
                    if title: headlines.append(title)

            if not headlines:
                return {
                    "sentiment": "neutral",
                    "confidence": 0.5,
                    "weights": {"positive": 0.33, "neutral": 0.34, "negative": 0.33},
                    "description": "No recent news headlines found."
                }

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
            
            description = f"Based on {len(headlines)} recent headlines. Dominant sentiment is {sentiment}."
            
            return {
                "sentiment": sentiment,
                "confidence": confidence,
                "weights": agg_weights,
                "description": description,
                "headline_count": len(headlines)
            }

        except Exception as e:
            print(f"Sentiment Error for {ticker}: {e}")
            return {"error": str(e)}

class MarketDataFetcher:
    @staticmethod
    def get_fundamentals(ticker: str):
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                "current_price": info.get("currentPrice"),
                "market_cap": info.get("marketCap"),
                "trailing_pe": info.get("trailingPE"),
                "forward_pe": info.get("forwardPE"),
                "52_week_high": info.get("fiftyTwoWeekHigh"),
                "52_week_low": info.get("fiftyTwoWeekLow"),
                "recommendation": info.get("recommendationKey", "none")
            }
        except Exception as e:
            print(f"Fundamental Data Error for {ticker}: {e}")
            return {}

class GeminiSummarizer:
    def __init__(self, api_key):
        if not api_key:
            raise ValueError("Gemini API Key is required.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_card(self, ticker, sentiment_data, fundamentals, user_profile="General Investor"):
        
        prompt = f"""
        Create a 3-sentence stock summary for {ticker} in plain English. Keep it under 85 words. No markdown.

        Audience: {user_profile}
        Sentiment: {sentiment_data.get('sentiment', 'unknown')} with confidence {sentiment_data.get('confidence', 0)}
        Context: {sentiment_data.get('description', 'No sentiment context available.')}
        Price: {fundamentals.get('current_price', 'N/A')}
        Trailing P/E: {fundamentals.get('trailing_pe', 'N/A')}
        Analyst view: {fundamentals.get('recommendation', 'N/A')}

        Sentence 1: sentiment and price action.
        Sentence 2: one fundamental detail.
        Sentence 3: practical outlook for the audience.
        If data is missing, say so briefly. Do not make up facts.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error generating summary: {e}"

if __name__ == "__main__":
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not found in environment variables.")
    sentiment_engine = SentimentAnalyzer()
    summarizer = None
    
    if GEMINI_API_KEY:
        try:
            summarizer = GeminiSummarizer(GEMINI_API_KEY)
        except Exception as e:
            print(f"Skipping AI Summarizer: {e}")

    tickers = ["AAPL", "TSLA", "NVDA"]
    final_output = []

    print("\n--- Starting Analysis Pipeline ---\n")

    for ticker in tickers:
        print(f"Processing {ticker}...")
        
        sent_result = sentiment_engine.analyze_sentiment(ticker)
        
        fund_result = MarketDataFetcher.get_fundamentals(ticker)
        
        ai_summary = "AI Summarizer not configured."
        if summarizer:
            ai_summary = summarizer.generate_card(
                ticker, 
                sent_result, 
                fund_result, 
                user_profile="Growth-focused Trader"
            )
            time.sleep(1)

        stock_card = {
            "ticker": ticker,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ui_card_data": {
                "summary_text": ai_summary,
                "badge_color": "green" if sent_result.get('sentiment') == "positive" else "yellow" if sent_result.get('sentiment') == "neutral" else "red",
                "display_sentiment": sent_result.get('sentiment'),
            },
            "raw_data": {
                "sentiment": sent_result,
                "fundamentals": fund_result
            }
        }
        
        final_output.append(stock_card)

    output_filename = f"nlp_summarizer_{datetime.now().strftime('%Y%m%d')}.json"
    with open(output_filename, 'w') as f:
        json.dump({"status": "success", "payload": final_output}, f, indent=2)

    print(f"\nJob Complete. Data saved to {output_filename}")
