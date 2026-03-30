# StockScope — Database Plan

This document describes every database StockScope needs, what each table stores, how data should be ordered/indexed, and which part of the codebase connects to it.

---

## Overview

StockScope uses **two databases**:

| Database | Role | Used By |
|---|---|---|
| **PostgreSQL** | Persistent storage — watchlists, cached NLP results, news snapshots | Backend, NLP |
| **Redis** | Fast in-memory TTL cache — price data, rate-limit protection | Backend |

> [!NOTE]
> During local development, you can replace PostgreSQL with **SQLite** (zero setup). The SQLAlchemy models are identical — just change the connection string in `backend/app/config.py`. Switch to PostgreSQL before any deployment.

---

## Part 1 — PostgreSQL

### Table 1: `watchlists`

**Purpose:** Replaces the current `backend/data/watchlist.json` flat file. Stores tickers each user has saved.

**Owned by:** Backend Team (`backend/app/routes/watchlist.py`)

```sql
CREATE TABLE watchlists (
    id          SERIAL PRIMARY KEY,
    ticker      VARCHAR(5)   NOT NULL,
    name        VARCHAR(100) NOT NULL,
    added_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_watchlist_ticker ON watchlists (ticker);
```

| Column | Type | Notes |
|---|---|---|
| `id` | integer | Auto-incrementing primary key |
| `ticker` | varchar(5) | Uppercase, e.g. `"AAPL"`. Unique — no duplicates |
| `name` | varchar(100) | Company display name, e.g. `"Apple Inc."` |
| `added_at` | timestamp | When the user added it — used for ordering |

**Default ordering:** `ORDER BY added_at DESC` (most recently added first)

**What changes in code:** `watchlist.py` currently reads/writes `watchlist.json`. Replace `load_watchlist()` and `save_watchlist()` with SQLAlchemy queries on this table.

---

### Table 2: `sentiment_cache`

**Purpose:** Stores NLP sentiment results so FinBERT doesn't re-run on every API request. Entries expire after 30 minutes (checked in app logic).

**Owned by:** NLP Team (writes) + Backend Team (reads via `backend/app/routes/sentiment.py`)

```sql
CREATE TABLE sentiment_cache (
    id              SERIAL PRIMARY KEY,
    ticker          VARCHAR(5)    NOT NULL,
    sentiment       VARCHAR(10)   NOT NULL,   -- 'positive', 'neutral', 'negative'
    confidence      FLOAT         NOT NULL,
    weight_positive FLOAT         NOT NULL,
    weight_neutral  FLOAT         NOT NULL,
    weight_negative FLOAT         NOT NULL,
    description     TEXT,
    headline_count  INT           DEFAULT 0,
    cached_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sentiment_ticker_time ON sentiment_cache (ticker, cached_at DESC);
```

| Column | Type | Notes |
|---|---|---|
| `ticker` | varchar(5) | The stock ticker |
| `sentiment` | varchar(10) | `'positive'`, `'neutral'`, or `'negative'` |
| `confidence` | float | 0.0–1.0 decimal confidence score |
| `weight_positive/neutral/negative` | float | The three probability weights from FinBERT |
| `description` | text | Human-readable summary string |
| `headline_count` | int | How many headlines the model analyzed |
| `cached_at` | timestamp | Cache freshness check — discard if older than 30 min |

**Default ordering:** `ORDER BY cached_at DESC LIMIT 1` per ticker (always grab the most recent)

**What changes in code:** `sentiment.py` (backend route) should check this table before calling `SentimentAnalyzer.analyze_sentiment()`. If a row exists for the ticker with `cached_at > NOW() - INTERVAL '30 minutes'`, return it directly.

---

### Table 3: `summary_cache`

**Purpose:** Stores AI-generated Gemini summaries. These are expensive (API call + latency). Cache for 60 minutes.

**Owned by:** NLP Team (writes) + Backend Team (reads via `backend/app/routes/summary.py`)

```sql
CREATE TABLE summary_cache (
    id           SERIAL PRIMARY KEY,
    ticker       VARCHAR(5)   NOT NULL,
    summary_text TEXT         NOT NULL,
    badge_color  VARCHAR(10)  NOT NULL,   -- 'green', 'yellow', 'red'
    sentiment    VARCHAR(10)  NOT NULL,
    user_profile VARCHAR(50)  DEFAULT 'General Investor',
    cached_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_summary_ticker_time ON summary_cache (ticker, cached_at DESC);
```

| Column | Type | Notes |
|---|---|---|
| `ticker` | varchar(5) | The stock ticker |
| `summary_text` | text | The 3-sentence AI paragraph from Gemini |
| `badge_color` | varchar(10) | `'green'` / `'yellow'` / `'red'` — set by sentiment |
| `sentiment` | varchar(10) | Display sentiment label |
| `user_profile` | varchar(50) | Which persona Gemini wrote for (e.g. `'Growth-focused Trader'`) |
| `cached_at` | timestamp | Expire after 60 minutes |

**Default ordering:** `ORDER BY cached_at DESC LIMIT 1` per ticker

**What changes in code:** `summarizer.py` already outputs `ui_card_data.summary_text` and `ui_card_data.badge_color` — write these fields directly into this table after generating.

---

### Table 4: `news_cache`

**Purpose:** Stores formatted news articles per ticker. Replaces the in-memory `_NEWS_CACHE` dict in `backend/app/routes/news.py` — this version survives server restarts.

**Owned by:** Backend Team (`backend/app/routes/news.py`)

```sql
CREATE TABLE news_cache (
    id           SERIAL PRIMARY KEY,
    ticker       VARCHAR(5)    NOT NULL,
    title        TEXT          NOT NULL,
    description  TEXT,
    url          TEXT,
    image        TEXT,
    published_at TIMESTAMPTZ,
    cached_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_ticker_pubdate ON news_cache (ticker, published_at DESC);
```

| Column | Type | Notes |
|---|---|---|
| `ticker` | varchar(5) | The stock ticker |
| `title` | text | Article headline |
| `description` | text | Article summary/snippet |
| `url` | text | Full article URL |
| `image` | text | Thumbnail image URL (falls back to placeholder) |
| `published_at` | timestamp | When the article was published — used for ordering |
| `cached_at` | timestamp | Expire after 5 minutes |

**Default ordering:** `ORDER BY published_at DESC` (newest articles first), return top 4

**What changes in code:** Replace the `_NEWS_CACHE` dict and TTL logic in `news.py` with a query to this table. On cache hit (`cached_at > NOW() - INTERVAL '5 minutes'`), return from DB. On miss, fetch from yfinance, insert rows, then return.

---

## Part 2 — Redis

Redis stores short-lived data that needs to be returned in milliseconds. No tables — just key-value pairs with expiry times (TTL).

### Keys to Store

| Redis Key Pattern | TTL | Data Stored | Replaces |
|---|---|---|---|
| `price:{ticker}:{timeframe}` | 5 min | Raw JSON from Alpha Vantage | Nothing yet — add this |
| `fundamentals:{ticker}` | 15 min | `yfinance` info dict | Nothing yet — add this |

> [!IMPORTANT]
> Alpha Vantage free tier is capped at **25 requests/day**. Without Redis caching on price data, you will hit this limit immediately during testing. This cache is **critical**.

**Where to add in code:**
- `backend/app/fetchers.py` → `get_price_data()`: Before calling Alpha Vantage, check Redis. Return cached JSON if present. On miss, fetch + store in Redis with 5-min TTL.
- `backend/app/routes/fundamentals.py`: Same pattern for `yfinance` fundamentals calls.

**Redis connection setup goes in:** `backend/app/utils/cache.py` (already planned in Week 8 of the README)

---

## Data Flow Summary

```
User selects ticker on Frontend
        │
        ▼
Backend /api/v1/sentiment/<ticker>
  1. Check sentiment_cache table → fresh? Return it.
  2. Cache miss → call NLP SentimentAnalyzer (FinBERT)
  3. Write result to sentiment_cache
  4. Return JSON to frontend

Backend /api/v1/price/<ticker>
  1. Check Redis key price:{ticker}:daily → hit? Return it.
  2. Cache miss → call Alpha Vantage API (fetchers.py)
  3. Store result in Redis with 5-min TTL
  4. Return JSON to frontend

Backend /api/v1/news/<ticker>
  1. Check news_cache table → fresh? Return top 4.
  2. Cache miss → call yfinance for news
  3. Insert new rows into news_cache
  4. Return JSON to frontend

Backend /api/v1/watchlist (GET/POST/DELETE)
  1. Read/write directly to watchlists table (replaces watchlist.json)
```

---

## Team Ownership Summary

| Table / Cache | Owner | File to Modify |
|---|---|---|
| `watchlists` (PG) | **Backend** | `routes/watchlist.py` |
| `news_cache` (PG) | **Backend** | `routes/news.py` |
| `sentiment_cache` (PG) | **Backend** (read) + **NLP** (write) | `routes/sentiment.py`, `sentiment.py` |
| `summary_cache` (PG) | **Backend** (read) + **NLP** (write) | `routes/summary.py`, `summarizer.py` |
| Redis price/fundamentals | **Backend** | `fetchers.py`, `utils/cache.py` |
| Frontend | No DB access | Talks to backend API only |

> [!NOTE]
> The Frontend team does **not** interact with any database directly. All data comes through the Flask `/api/v1/` endpoints.

---

## Setup Checklist (for whoever sets up the DB)

- [ 

] Install PostgreSQL locally (or use a hosted instance like Supabase/Neon for free)
- [ ] Install Redis locally (or use Upstash for free hosted Redis)
- [ ] Add connection strings to `backend/.env`:
  ```
  DATABASE_URL=postgresql://user:password@localhost:5432/stockscope
  REDIS_URL=redis://localhost:6379
  ```
- [ ] Install Python packages: `psycopg2-binary`, `redis`, `flask-sqlalchemy`
- [ ] Run the `CREATE TABLE` SQL statements above to initialize the schema
- [ ] Update `backend/app/__init__.py` to initialize SQLAlchemy with `DATABASE_URL`
