# NLP Prompt Engineering — Improvement Plan
### File: `nlp/summarizer.py` → `GeminiSummarizer.generate_card()`

This plan is for the **NLP Team**. No backend or frontend changes are needed — all work is isolated to `nlp/summarizer.py`. The goal is to make Gemini produce more accurate, personalized, and structured investment summaries.

---

## What We're Improving

The current prompt in `generate_card()` has 5 weaknesses:

| # | Problem | Impact |
|---|---|---|
| 1 | Only one string (`user_profile`) drives personalization | Summaries feel generic |
| 2 | No price trend context passed to Gemini | Gemini can't mention momentum |
| 3 | No indicator data in the prompt | Summary ignores RSI, MACD, Bollinger |
| 4 | Output format is unstructured plain text | Hard for frontend to parse or style |
| 5 | No fallback prompt when data is missing | Gemini hallucinates or errors |

---

## Improvement 1 — Richer Data Injection

**Problem:** The current prompt only passes `current_price`, `trailing_pe`, and `recommendation`. It ignores price trend, 52-week range, and market cap even though `MarketDataFetcher.get_fundamentals()` already returns them.

**Current code in `generate_card()`:**
```python
- Price: {fundamentals.get('current_price', 'N/A')}
- P/E Ratio: {fundamentals.get('trailing_pe', 'N/A')}
- Analyst Rec: {fundamentals.get('recommendation', 'N/A')}
```

**Improved version:**
```python
- Current Price: ${fundamentals.get('current_price', 'N/A')}
- P/E Ratio (Trailing): {fundamentals.get('trailing_pe', 'N/A')}
- P/E Ratio (Forward): {fundamentals.get('forward_pe', 'N/A')}
- Market Cap: ${fundamentals.get('market_cap', 'N/A'):,}
- 52-Week High: ${fundamentals.get('52_week_high', 'N/A')}
- 52-Week Low: ${fundamentals.get('52_week_low', 'N/A')}
- Analyst Consensus: {fundamentals.get('recommendation', 'N/A').upper()}
```

> [!NOTE]
> All these keys already exist in `MarketDataFetcher.get_fundamentals()` — this is a zero-effort data upgrade.

---

## Improvement 2 — Add Price Trend Context

**Problem:** Gemini doesn't know if the stock is trending up or down over the period. `summary_data.py` already computes `change_pct` — pass it in.

**Add a new parameter to `generate_card()`:**
```python
def generate_card(self, ticker, sentiment_data, fundamentals, price_trend=None, user_profile="General Investor"):
```

**Add to the prompt:**
```python
price_trend_str = ""
if price_trend:
    direction = "up" if price_trend.get("change_pct", 0) > 0 else "down"
    price_trend_str = f"- Price Trend: {direction} {abs(price_trend.get('change_pct', 0))}% over the analyzed period (from ${price_trend.get('first_price','N/A')} to ${price_trend.get('latest_price','N/A')})"

# Then in prompt f-string:
{price_trend_str}
```

**In `summary_data.py`, update the call:**
```python
result = summarizer.generate_card(
    ticker=ticker,
    sentiment_data=sentiment_data,
    fundamentals=fundamentals,
    price_trend=chart_snapshot,   # already computed above
    user_profile="General Investor"
)
```

---

## Improvement 3 — Expand Persona System

**Problem:** `user_profile` is a single hardcoded string `"General Investor"` all the time. The system is already designed for personas but they're never used.

**Define a structured persona dictionary instead of just a string:**

```python
PERSONAS = {
    "general": {
        "label": "General Investor",
        "tone": "balanced and easy to understand",
        "focus": "overall health and outlook",
        "avoid": "excessive jargon or complex derivatives terminology"
    },
    "day_trader": {
        "label": "Active Day Trader",
        "tone": "direct, data-driven, and concise",
        "focus": "short-term price momentum, volume, and technical signals",
        "avoid": "long-term projections"
    },
    "long_term": {
        "label": "Long-Term Buy-and-Hold Investor",
        "tone": "measured and fundamental",
        "focus": "valuation metrics (P/E, market cap), moat, and analyst consensus",
        "avoid": "short-term noise and daily price swings"
    },
    "beginner": {
        "label": "First-Time Investor",
        "tone": "friendly, simple, and encouraging",
        "focus": "what the company does and whether it seems like a safe investment",
        "avoid": "complex ratios and technical terminology"
    },
    "risk_averse": {
        "label": "Risk-Averse Investor",
        "tone": "cautious and conservative",
        "focus": "downside risk, 52-week lows, negative sentiment signals",
        "avoid": "speculative language or overly optimistic projections"
    }
}
```

**Update `generate_card()` signature:**
```python
def generate_card(self, ticker, sentiment_data, fundamentals, price_trend=None, persona_key="general"):
    persona = PERSONAS.get(persona_key, PERSONAS["general"])
```

---

## Improvement 4 — Improved Prompt Structure

**Replace the current prompt with this structured version:**

```python
prompt = f"""
You are a financial analyst AI assistant writing a "Stock Summary Card" for {ticker}.

AUDIENCE: {persona['label']}
TONE: {persona['tone']}
FOCUS: {persona['focus']}
AVOID: {persona['avoid']}

MARKET DATA:
- Sentiment: {sentiment_data.get('sentiment', 'Unknown').upper()} (Confidence: {sentiment_data.get('confidence', 0):.0%})
- Context: {sentiment_data.get('description', 'No context available.')}
- Based on {sentiment_data.get('headline_count', 0)} recent headlines.

PRICE & FUNDAMENTALS:
- Current Price: ${fundamentals.get('current_price', 'N/A')}
- Market Cap: ${fundamentals.get('market_cap', 'N/A')}
- Trailing P/E: {fundamentals.get('trailing_pe', 'N/A')}
- Forward P/E: {fundamentals.get('forward_pe', 'N/A')}
- 52-Week High: ${fundamentals.get('52_week_high', 'N/A')}
- 52-Week Low: ${fundamentals.get('52_week_low', 'N/A')}
- Analyst Consensus: {fundamentals.get('recommendation', 'N/A').upper()}
{price_trend_str}

OUTPUT FORMAT:
Write exactly 3 sentences. No markdown. No bullet points. No headers.
- Sentence 1: Current sentiment and recent price action.
- Sentence 2: One key fundamental stat in context of the sentiment.
- Sentence 3: A brief outlook tailored to a {persona['label']}.

If any data is missing or 'N/A', acknowledge uncertainty rather than fabricating numbers.
"""
```

---

## Improvement 5 — Graceful Fallback Prompt

**Problem:** If fundamentals or sentiment are empty, Gemini currently receives `N/A` for everything and may hallucinate.

**Add a fallback check before calling Gemini:**

```python
def generate_card(self, ticker, sentiment_data, fundamentals, price_trend=None, persona_key="general"):
    # Guard: if both data sources are empty, return a safe fallback
    has_sentiment = sentiment_data and "sentiment" in sentiment_data
    has_fundamentals = fundamentals and any(v is not None for v in fundamentals.values())

    if not has_sentiment and not has_fundamentals:
        return (
            f"Insufficient market data is currently available for {ticker}. "
            "No recent sentiment signals or fundamental metrics could be retrieved. "
            "Please try again later or check if the ticker symbol is correct."
        )
    
    # ... rest of generate_card
```

---

## Testing Checklist

After making changes, run the existing script to verify:

```bash
cd nlp
python summarizer.py
```

Check that:
- [ ] Each persona produces a noticeably different tone in the output
- [ ] Price trend direction (up/down %) appears in the summary sentence
- [ ] Summaries don't mention data that was `N/A`
- [ ] The fallback string is returned when both `sentiment_data` and `fundamentals` are empty `{}`
- [ ] The output JSON file (`nlp_summarizer_YYYYMMDD.json`) still writes correctly

---

## Files to Modify

| File | Change |
|---|---|
| `nlp/summarizer.py` | All 5 improvements — main file |
| `backend/app/summary_data.py` | Pass `chart_snapshot` as `price_trend` and `persona_key` from user profile |

> [!IMPORTANT]
> The `persona_key` will eventually come from the user's account/survey (see the Onboarding Plan). For now, default it to `"general"` in `summary_data.py` until the frontend survey is built.
