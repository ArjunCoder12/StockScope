# Interactive Onboarding & NLP Personalization — Plan
### Teams: Frontend + Backend + NLP

This plan describes how to build a first-time user onboarding experience that collects a user's investor profile via a short survey, stores it, and uses it to personalize the AI-generated summaries in `SummaryCard.tsx`.

---

## Feature Overview

```
New User Lands → Onboarding Tour → Survey ("Tell us about you")
       │
       ▼
Backend stores persona_key (e.g. "day_trader")
       │
       ▼
/api/v1/summary/<ticker> passes persona_key to Gemini
       │
       ▼
SummaryCard.tsx shows a summary written for that investor type
```

---

## Part 1 — Frontend Team

### 1A. Onboarding Tour Modal

**New file:** `frontend/src/components/OnboardingTour.tsx`

This is a multi-step modal that appears the **first time** a user visits the dashboard (tracked via `localStorage`).

**Steps:**
| Step # | Content |
|---|---|
| 1 | Welcome screen — "Welcome to StockScope! Let's get you set up." |
| 2 | Quick walkthrough — highlight the Search Bar, Chart Panel, Sentiment Card, and Summary Card with tooltips/spotlights |
| 3 | Survey — "Tell us about yourself" (see 1B below) |
| 4 | Confirmation — "You're all set! Your dashboard is now personalized." |

**Trigger logic (in `App.tsx` or `Dashboard.tsx`):**
```tsx
const hasOnboarded = localStorage.getItem("stockscope_onboarded");
if (!hasOnboarded) {
  // show <OnboardingTour />
}
// On survey completion:
localStorage.setItem("stockscope_onboarded", "true");
localStorage.setItem("stockscope_persona", personaKey); // e.g. "day_trader"
```

---

### 1B. Investor Survey Component

**New file:** `frontend/src/components/InvestorSurvey.tsx`

A short 3-question survey shown inside the onboarding modal on Step 3.

**Question 1 — Experience Level**
> "How long have you been investing?"
- 🟢 Just getting started (maps toward `"beginner"`)
- 🔵 1–3 years (maps toward `"general"`)
- 🟣 3+ years (maps toward `"long_term"` or `"day_trader"`)

**Question 2 — Investment Style**
> "What's your investing approach?"
- ⚡ I trade frequently / follow daily price movements → `"day_trader"`
- 📈 I buy and hold for years → `"long_term"`
- 🛡️ I play it safe, capital preservation is key → `"risk_averse"`
- 🤷 I'm not sure yet → `"general"`

**Question 3 — Risk Tolerance**
> "How do you feel about risk?"
- 🎯 High risk, high reward
- ⚖️ Balanced
- 🔒 I prefer low risk

**Persona Scoring Logic (in the component):**
```tsx
function derivePersona(q1: string, q2: string, q3: string): string {
  if (q1 === "beginner") return "beginner";       // override: always beginner mode if new
  if (q2 === "day_trader") return "day_trader";
  if (q2 === "long_term") return "long_term";
  if (q2 === "risk_averse" || q3 === "low") return "risk_averse";
  return "general"; // default fallback
}
```

**On survey submit:**
1. Derive `persona_key` from answers
2. `POST /api/v1/user/persona` with `{ persona_key }`
3. Save `persona_key` to `localStorage` as backup
4. Proceed to Step 4 of onboarding

---

### 1C. Passing Persona to the Summary API

**File to update:** `frontend/src/api/` (wherever `useSummaryData` hook is defined)

Update the summary API call to pass persona as a query param:

```tsx
// Before:
fetch(`/api/v1/summary/${ticker}`)

// After:
const persona = localStorage.getItem("stockscope_persona") || "general";
fetch(`/api/v1/summary/${ticker}?persona=${persona}`)
```

---

### 1D. Settings Page — Allow Re-taking Survey

Add a "Retake Investor Survey" button somewhere in the NavBar or a settings dropdown. It clears `localStorage` and re-triggers `<OnboardingTour />` starting at Step 3.

---

## Part 2 — Backend Team

### 2A. New Route: `POST /api/v1/user/persona`

**New file:** `backend/app/routes/user.py`

Stores the user's persona selection. Since there's no auth yet, persist to a simple JSON file (same pattern as `watchlist.json`).

```python
@user_bp.route("/user/persona", methods=["POST"])
def set_persona():
    body = request.get_json(silent=True) or {}
    persona_key = body.get("persona_key", "general")

    VALID_PERSONAS = {"general", "beginner", "day_trader", "long_term", "risk_averse"}
    if persona_key not in VALID_PERSONAS:
        return jsonify({"status": "error", "message": "Invalid persona"}), 400

    # Save to data/user_profile.json
    save_user_profile({"persona_key": persona_key})
    return jsonify({"status": "success", "persona_key": persona_key}), 200

@user_bp.route("/user/persona", methods=["GET"])
def get_persona():
    profile = load_user_profile()
    return jsonify({"status": "success", "persona_key": profile.get("persona_key", "general")}), 200
```

> [!NOTE]
> Store to `backend/data/user_profile.json`. Same pattern as `watchlist.json`. When you add proper user accounts + the `users` PostgreSQL table later, swap `save_user_profile()` for a DB write.

---

### 2B. Update `/api/v1/summary/<ticker>` to Accept Persona

**File to update:** `backend/app/routes/summary.py`

```python
from flask import request

@summary_bp.route("/summary/<ticker>", methods=["GET"])
def get_summary(ticker):
    ticker = ticker.upper()
    persona_key = request.args.get("persona", "general")  # read from ?persona=day_trader

    error_msg = validate_ticker(ticker)
    if error_msg:
        return jsonify({"status": "error", "message": error_msg}), 400

    try:
        result = fetch_summary(ticker, persona_key=persona_key)  # pass it down
        return jsonify({"status": "success", "ticker": ticker, "summary": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
```

---

### 2C. Thread Persona Through `summary_data.py`

**File to update:** `backend/app/summary_data.py`

```python
def fetch_news_summary(ticker, persona_key="general"):
    key = f"news_sum_{ticker}_{persona_key}"   # cache per persona!
    ...
    result = summarizer.generate_card(
        ticker=ticker,
        sentiment_data=sentiment_data,
        fundamentals=fundamentals,
        price_trend=chart_snapshot,
        persona_key=persona_key            # <-- new arg
    )

def fetch_summary(ticker, persona_key="general"):
    ...
    news_summary = fetch_news_summary(ticker, persona_key=persona_key)
    ...
```

> [!IMPORTANT]
> Update the cache key to include `persona_key` (e.g. `news_sum_AAPL_day_trader`). Otherwise all personas would get the same cached summary.

---

## Part 3 — NLP Team

The NLP team's work is already described in the **NLP Prompt Engineering Plan**. The key integration point is:

- `GeminiSummarizer.generate_card()` must accept `persona_key` (not a raw string)
- Use the `PERSONAS` dict defined in that plan to look up tone/focus/avoid instructions
- The `persona_key` values must match exactly: `"general"`, `"beginner"`, `"day_trader"`, `"long_term"`, `"risk_averse"`

---

## Data Flow (End-to-End)

```
[Frontend Survey] 
  → POST /api/v1/user/persona { persona_key: "day_trader" }
  → Stored in backend/data/user_profile.json

[User selects ticker AAPL]
  → GET /api/v1/summary/AAPL?persona=day_trader

[Backend summary.py]
  → calls fetch_summary("AAPL", persona_key="day_trader")
  → calls fetch_news_summary() → GeminiSummarizer.generate_card(..., persona_key="day_trader")
  → Gemini writes a summary in the "Active Day Trader" tone

[Frontend SummaryCard.tsx]
  → Displays the personalized 3-sentence summary
```

---

## New Files Summary

| File | Team | Purpose |
|---|---|---|
| `frontend/src/components/OnboardingTour.tsx` | **Frontend** | Multi-step modal + tour controller |
| `frontend/src/components/InvestorSurvey.tsx` | **Frontend** | Survey UI + persona scoring logic |
| `backend/app/routes/user.py` | **Backend** | GET/POST /user/persona endpoint |
| `backend/data/user_profile.json` | **Backend** | Persona persistence (auto-created) |

## Files to Modify

| File | Team | Change |
|---|---|---|
| `frontend/src/App.tsx` | **Frontend** | Trigger `<OnboardingTour />` on first visit |
| `frontend/src/api/hooks/generalHooks.tsx` | **Frontend** | Pass `?persona=` to summary fetch |
| `backend/app/__init__.py` | **Backend** | Register `user_bp` blueprint |
| `backend/app/routes/summary.py` | **Backend** | Accept `?persona=` query param |
| `backend/app/summary_data.py` | **Backend** | Pass `persona_key` through to NLP |
| `nlp/summarizer.py` | **NLP** | Accept `persona_key`, use PERSONAS dict |

---

## Implementation Order (Recommended)

1. **NLP first** — Implement the improved `generate_card()` with the `PERSONAS` dict. Test via `python summarizer.py`. This unblocks everyone else.
2. **Backend** — Add `/user/persona` route and update `/summary/<ticker>` to pass `persona_key` down.
3. **Frontend** — Build `InvestorSurvey.tsx` and wire up the API call.
4. **Frontend** — Build the full `OnboardingTour.tsx` modal around the survey.
5. **Integration test** — Go through the full onboarding flow, pick "Day Trader", search a ticker, verify the summary sounds different vs. "Beginner" mode.
