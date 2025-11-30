# Sentiment Analysis Report  
*StockScope — FinBERT-Based Market Direction Evaluation*

---

## Overview

This report reviews how the StockScope sentiment pipeline performed when predicting future market direction using FinBERT-derived news sentiment.

Each signal reflects aggregated sentiment probabilities from recent headlines for AAPL, TSLA, MRK, and TTWO, all logged on November 12, 2025. These signals were later compared against realized 1-day, 3-day, and 5-day returns computed from subsequent trading-day closes.

---

## Methodology

The model’s directional prediction is based on the sign of the following expression:

p_positive minus p_negative

(positive probability) – (negative probability)

- Positive value: Sentiment is positive → Prediction: UP  
- Negative value: Sentiment is negative → Prediction: DOWN

This makes evaluation straightforward: compare predicted direction versus the sign of the actual future returns.

---

## Realized Returns Data

Across the eight logged signals:

- MRK was the only ticker with net positive sentiment → Predicted UP  
- AAPL, TSLA, and TTWO all had stronger negative sentiment → Predicted DOWN

### Ticker Returns (%)

| Ticker | 1-Day | 3-Day | 5-Day |
|-------|------:|------:|------:|
| AAPL | -0.19 | -2.136 | -2.11 |
| TSLA | -6.644 | -4.348 | -4.385 |
| MRK  | +1.618 | +2.75  | +2.745 |
| TTWO | -1.161 | -2.58  | -2.546 |

---

## Performance Analysis

The alignment between sentiment predictions and actual movements was perfect across all horizons:

- MRK: Predicted UP → Delivered positive returns at 1, 3, and 5 days  
- AAPL, TSLA, TTWO: Predicted DOWN → Delivered negative returns across all horizons

### Accuracy Metrics

- 1-Day Accuracy: 100% (8/8)  
- 3-Day Accuracy: 100% (8/8)  
- 5-Day Accuracy: 100% (8/8)

---

## Conclusion

Magnitude behavior reinforces the directional findings:

- DOWN-predicted tickers averaged approximately:  
  - -2.67% (1-day)  
  - -3.02% (3-day)  
  - -3.01% (5-day)  
  showing consistent downward movement over longer horizons.  

- MRK, the only UP-predicted ticker, strengthened from +1.62% to +2.75%, reflecting stable upward momentum.

Note: Results are strong but based on a small dataset and a single timestamp window. Future work will focus on expanding to multi-day logs and richer evaluation metrics.

---
