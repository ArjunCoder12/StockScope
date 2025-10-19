# StockScope Backend API Specification

**Frontend Team Contact**: Anthony Dierkes
**Last Updated**: October 16, 2025  
**Base URL**: `http://localhost:8000/api` (for dev env)

---

## Overview

This document specifies the API endpoints and data formats required by the frontend application. All responses must follow the structure defined below.

### General Response Format

All endpoints should return JSON with this structure:

```json
{
  "status": "success" | "error",
  "data": [...],
  "message": "Optional error/success message"
}
```

---

## Endpoints

### 1. Stock List

**GET** `/api/v1/stock-list`

Get the list of stocks for the user's watchlist/portfolio.

#### Response Format

```json
{
  "status": "success",
  "data": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "price": 178.25,
      "change": 2.45,
      "status": "active"
    },
    {
      "ticker": "TSLA",
      "name": "Tesla Inc.",
      "price": 242.8,
      "change": -1.23,
      "status": "active"
    }
  ]
}
```

#### Field Specifications

| Field    | Type   | Required | Description                         |
| -------- | ------ | -------- | ----------------------------------- |
| `ticker` | string | ✅ Yes   | Stock ticker symbol (e.g., "AAPL")  |
| `name`   | string | ✅ Yes   | Company name                        |
| `price`  | number | ✅ Yes   | Current stock price                 |
| `change` | number | ✅ Yes   | Price change (positive or negative) |
| `status` | string | ✅ Yes   | Stock status (e.g., "active")       |

---

### 2. Chart Data (Price History)

**GET** `/api/v1/charting/{ticker}`

Get historical price data for a specific stock.
For now it should just be daily closes.

#### Path Parameters

- `ticker` (string, required): Stock ticker symbol (e.g., "AAPL")

#### Response Format

```json
{
  "status": "success",
  "data": [
    {
      "date": "Oct 1",
      "price": 178.25,
      "volume": 45230000,
      "open": 178.0,
      "high": 179.5,
      "low": 177.8,
      "close": 178.25
    },
    {
      "date": "Oct 2",
      "price": 180.5,
      "volume": 48920000,
      "open": 178.25,
      "high": 181.0,
      "low": 178.0,
      "close": 180.5
    }
  ]
}
```

#### Field Specifications

| Field    | Type   | Required    | Description                                                          |
| -------- | ------ | ----------- | -------------------------------------------------------------------- |
| `date`   | string | ✅ Yes      | Date label (e.g., "Oct 1", "2024-10-01", or "10:30 AM" for intraday) |
| `price`  | number | ✅ Yes      | Stock price at this point                                            |
| `volume` | number | ⚠️ Optional | Trading volume                                                       |
| `open`   | number | ⚠️ Optional | Opening price                                                        |
| `high`   | number | ⚠️ Optional | Highest price                                                        |
| `low`    | number | ⚠️ Optional | Lowest price                                                         |
| `close`  | number | ⚠️ Optional | Closing price                                                        |

#### Notes

- For **daily data**: Use date format like "Oct 1" or "2024-10-01"
- Minimum required: `date` and `price` (all other fields are optional but recommended)

---

### 3. Sentiment Analysis

**GET** `/api/v1/sentiment/{ticker}`

Get sentiment analysis for a specific stock.

#### Path Parameters

- `ticker` (string, required): Stock ticker symbol (e.g., "AAPL")

#### Response Format

```json
{
  "status": "success",
  "data": [
    {
      "ticker": "AAPL",
      "sentiment": "positive",
      "confidence": 0.85,
      "description": "Strong bullish sentiment driven by positive earnings report and new product announcements. Market analysts are optimistic about growth prospects.",
      "lastUpdated": "2024-10-16T10:30:00Z"
    }
  ]
}
```

#### Field Specifications

| Field         | Type   | Required | Description                                                                          |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `ticker`      | string | ✅ Yes   | Stock ticker symbol                                                                  |
| `sentiment`   | string | ✅ Yes   | Sentiment classification: "positive", "negative", "neutral", "bullish", or "bearish" |
| `confidence`  | number | ✅ Yes   | Confidence score (0.0 to 1.0, e.g., 0.85 = 85%)                                      |
| `description` | string | ✅ Yes   | Detailed sentiment explanation                                                       |
| `lastUpdated` | string | ✅ Yes   | ISO 8601 timestamp of analysis                                                       |

#### Sentiment Values

- **Positive/Bullish**: Good outlook, price likely to rise
- **Negative/Bearish**: Poor outlook, price likely to fall
- **Neutral**: Mixed or unclear signals

#### Notes

- `confidence` must be between 0 and 1 (frontend will convert to percentage)
- Frontend displays first item in array (send most recent analysis)

---

### 4. News Feed

**GET** `/api/v1/news/{ticker}`

Get news articles for a specific stock.

#### Path Parameters

- `ticker` (string, required): Stock ticker symbol (e.g., "AAPL")

#### Response Format

```json
{
  "status": "success",
  "data": [
    {
      "ticker": "AAPL",
      "title": "Apple Announces New Product Line for 2025",
      "description": "Apple Inc. unveiled its latest innovations at the annual product event, showcasing new hardware and software features.",
      "url": "https://example.com/article/apple-announces-new-products",
      "image": "https://example.com/images/apple-event.jpg",
      "lastUpdated": "2024-10-16T09:15:00Z"
    },
    {
      "ticker": "AAPL",
      "title": "Apple Stock Hits New High",
      "description": "Apple shares reached a new all-time high following strong quarterly earnings.",
      "url": "https://example.com/article/apple-stock-high",
      "image": "https://example.com/images/apple-stock.jpg",
      "lastUpdated": "2024-10-15T14:20:00Z"
    }
  ]
}
```

#### Field Specifications

| Field         | Type   | Required | Description                                                                 |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| `ticker`      | string | ✅ Yes   | Stock ticker symbol                                                         |
| `title`       | string | ✅ Yes   | Article headline                                                            |
| `description` | string | ✅ Yes   | Article summary/preview                                                     |
| `url`         | string | ✅ Yes   | Link to full article                                                        |
| `image`       | string | ✅ Yes   | Article image URL (use placeholder if none: "https://placehold.co/600x400") |
| `lastUpdated` | string | ✅ Yes   | ISO 8601 timestamp of article publication                                   |

#### Notes

- Return articles sorted by `lastUpdated` (newest first)
- Frontend displays up to 4 articles

---

## Error Handling

When an error occurs, return:

```json
{
  "status": "error",
  "data": [],
  "message": "Description of what went wrong"
}
```

---

##Quick Reference

| Endpoint                     | Method | Description            |
| ---------------------------- | ------ | ---------------------- |
| `/api/v1/stock-list`         | GET    | User's stock watchlist |
| `/api/v1/charting/{ticker}`  | GET    | Historical price data  |
| `/api/v1/sentiment/{ticker}` | GET    | Sentiment analysis     |
| `/api/v1/news/{ticker}`      | GET    | News articles          |

---

## Notes

- **CORS**: Make sure CORS is enabled
- **Content-Type**: All responses should have `Content-Type: application/json`
- **Timestamps**: Use ISO 8601 format (e.g., `2024-10-16T10:30:00Z`)
- **Decimals**: Return numbers with appropriate precision (e.g., prices to 2 decimals)

---

## Questions?

If you have questions or need clarification on any endpoint, please reach out to Anthony Dierkes.
