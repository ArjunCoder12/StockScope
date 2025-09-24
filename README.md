# StockScope - AI-Powered Stock Analysis Dashboard

A comprehensive stock analysis platform that combines real-time market data, technical indicators, sentiment analysis, and AI-generated investment summaries.

## Project Structure

```
StockScope_Skel/
├── frontend/          # React.js dashboard
├── backend/          # Flask API server
├── nlp/             # Natural Language Processing
└── docs/            # Documentation
```

## Team Assignments

### Frontend Team (React.js)
- **Primary Files**: `frontend/src/`
- **Key Components**: Dashboard, Charts, Search, UI Components
- **Tech Stack**: React, Plotly.js, Axios

### Backend Team (Flask API)
- **Primary Files**: `backend/app/`
- **Key Components**: API Routes, Data Services, Caching
- **Tech Stack**: Flask, SQLAlchemy, Redis, External APIs

### NLP Team (Machine Learning)
- **Primary Files**: `nlp/`
- **Key Components**: Sentiment Analysis, Text Summarization, Model Training
- **Tech Stack**: Python, scikit-learn, transformers, pandas

---

## 10-Week Development Timeline

### **Week 1 – Repo Setup & Project Skeletons**
**Goal:** Everyone can run frontend, backend, and NLP skeleton locally.

#### Frontend Team
- **Files**: `frontend/src/App.js`, `frontend/src/components/`
- **Tasks**: 
  - Create skeleton dashboard layout (NavBar, empty chart panel, empty sentiment card)
  - Set up React development environment
- **Deliverable**: React app runs on `localhost:3000` with placeholder panels

#### Backend Team
- **Files**: `backend/app/__init__.py`, `backend/app/routes/hello.py`
- **Tasks**: 
  - Set up Flask app with basic structure
  - Create `/api/v1/hello` endpoint returning `{ "message": "Hello StockScope" }`
- **Deliverable**: Flask API runs on `localhost:5000`

#### NLP Team
- **Files**: `nlp/sentiment.py`
- **Tasks**: 
  - Create dummy `analyze_sentiment(ticker)` function
  - Function returns `{positive:0.33, neutral:0.33, negative:0.33}`
- **Deliverable**: Callable mock NLP function

#### Documentation
- **Files**: `docs/architecture.md`, `docs/api_contract.md`
- **Tasks**: 
  - Finalize system architecture
  - Define API endpoints and data contracts
- **Deliverable**: Everyone aligned on data flow & API contract

---

### **Week 2 – Ticker Search & API Stubs**
**Goal:** Users can search ticker, backend has stub endpoints returning mock data.

#### Frontend Team
- **Files**: `frontend/src/components/SearchBar.js`, `frontend/src/services/api.js`
- **Tasks**: 
  - Build ticker search bar with autocomplete from static list
  - Create API service layer
- **Deliverable**: Selecting a ticker updates dashboard placeholder

#### Backend Team
- **Files**: `backend/app/routes/price.py`, `backend/app/routes/fundamentals.py`
- **Tasks**: 
  - Stub `/price/<ticker>` and `/fundamentals/<ticker>` endpoints
  - Return fake JSON using static data
- **Deliverable**: API responds with mock data

#### NLP Team
- **Files**: `nlp/sentiment.py`
- **Tasks**: 
  - Expand dummy function to return sentiment + 3 placeholder headlines
- **Deliverable**: API-ready JSON mock

---

### **Week 3 – Live Price Data Integration**
**Goal:** Real stock/ETF price chart loads.

#### Frontend Team
- **Files**: `frontend/src/components/PriceChart.js`
- **Tasks**: 
  - Integrate Plotly chart with mock data from API
- **Deliverable**: Chart renders fake stock price

#### Backend Team
- **Files**: `backend/app/services/fetchers.py`
- **Tasks**: 
  - Implement `get_price_data(ticker, timeframe)` using Alpha Vantage
- **Deliverable**: `/price/<ticker>` serves real API data

#### NLP Team
- **Files**: `nlp/preprocessing.py`
- **Tasks**: 
  - Start pipeline: clean text, tokenize
- **Deliverable**: Ready-to-train preprocessing functions

---

### **Week 4 – Fundamentals Snapshot**
**Goal:** Dashboard shows live market cap, P/E, volume.

#### Frontend Team
- **Files**: `frontend/src/components/FundamentalsCard.js`
- **Tasks**: 
  - Create fundamentals panel UI
- **Deliverable**: Display fundamentals below chart

#### Backend Team
- **Files**: `backend/app/routes/fundamentals.py`
- **Tasks**: 
  - Implement live fundamentals using Yahoo Finance API (`yfinance`)
- **Deliverable**: `/fundamentals/<ticker>` returns real data

#### NLP Team
- **Files**: `nlp/notebooks/sentiment_experiments.ipynb`
- **Tasks**: 
  - Run first sentiment classification experiments (logistic regression, pretrained models)
- **Deliverable**: Baseline model evaluation

---

### **Week 5 – Technical Indicators**
**Goal:** Users can toggle MACD, RSI, Bollinger Bands overlays.

#### Frontend Team
- **Files**: `frontend/src/components/IndicatorToggle.js`, update `PriceChart.js`
- **Tasks**: 
  - Add checkboxes for indicators, render overlays on chart
- **Deliverable**: Toggle indicators on/off

#### Backend Team
- **Files**: `backend/app/services/indicators.py`, `backend/app/routes/indicators.py`
- **Tasks**: 
  - Implement indicator calculations (MACD, RSI, Bollinger)
- **Deliverable**: `/indicators/<ticker>` returns indicator data

#### NLP Team
- **Files**: `nlp/sentiment.py`
- **Tasks**: 
  - Replace dummy output with model inference (baseline)
- **Deliverable**: Returns real sentiment percentages for test data

---

### **Week 6 – Sentiment Visualization**
**Goal:** Sentiment analysis visible on dashboard.

#### Frontend Team
- **Files**: `frontend/src/components/SentimentChart.js`
- **Tasks**: 
  - Display pie/bar chart with sentiment distribution
- **Deliverable**: Sentiment chart updates with ticker

#### Backend Team
- **Files**: `backend/app/routes/sentiment.py`
- **Tasks**: 
  - Connect to NLP sentiment service, return scores + headlines
- **Deliverable**: `/sentiment/<ticker>` live endpoint

#### NLP Team
- **Files**: `nlp/sentiment.py`
- **Tasks**: 
  - Optimize sentiment model, return top 3 headlines with scores
- **Deliverable**: Ready to serve real predictions

---

### **Week 7 – AI Investment Summary**
**Goal:** Short summary card combines fundamentals + indicators + sentiment.

#### Frontend Team
- **Files**: `frontend/src/components/SummaryCard.js`
- **Tasks**: 
  - Create summary card UI
- **Deliverable**: Displays AI-generated summary

#### Backend Team
- **Files**: `backend/app/routes/summary.py`
- **Tasks**: 
  - Call NLP summarizer, merge with indicators/fundamentals
- **Deliverable**: `/summary/<ticker>` returns text

#### NLP Team
- **Files**: `nlp/summarizer.py`
- **Tasks**: 
  - Implement rule-based + ML summary generation
- **Deliverable**: 2–3 sentence human-readable summary

---

### **Week 8 – Full Dashboard Integration**
**Goal:** All features connected and working together.

#### Frontend Team
- **Files**: `frontend/src/pages/Dashboard.js`
- **Tasks**: 
  - Wire all components (SearchBar, Chart, Fundamentals, Sentiment, Summary)
- **Deliverable**: Fully functional dashboard for selected ticker

#### Backend Team
- **Files**: `backend/app/utils/cache.py`
- **Tasks**: 
  - Add caching layer to reduce API calls
- **Deliverable**: Faster, rate-limit safe responses

#### NLP Team
- **Files**: `nlp/tests/test_sentiment.py`, `nlp/tests/test_summary.py`
- **Tasks**: 
  - Unit tests for NLP outputs
- **Deliverable**: Passing tests, accuracy ≥70%

---

### **Week 9 – Testing & Export Feature**
**Goal:** Reliability + optional report export.

#### Frontend Team
- **Files**: `frontend/src/components/ExportButton.js`
- **Tasks**: 
  - Add "Export as PDF/CSV" button
- **Deliverable**: Downloadable reports

#### Backend Team
- **Files**: `backend/app/routes/export.py`
- **Tasks**: 
  - Generate report with ticker, chart snapshot, sentiment, summary
- **Deliverable**: Export API working

#### NLP Team
- **Files**: `nlp/tests/`
- **Tasks**: 
  - Improve robustness (edge cases: no news, unknown tickers)
- **Deliverable**: Graceful fallback handling

---

### **Week 10 – Polish, Deployment, Demo**
**Goal:** Deliver final product, ready to present.

#### Frontend Team
- **Files**: All components
- **Tasks**: 
  - UI polish (styling, responsiveness, bug fixes)
- **Deliverable**: Clean, professional dashboard

#### Backend Team
- **Files**: `backend/config.py`, deployment files
- **Tasks**: 
  - Deploy Flask API (Heroku/AWS/GCP)
- **Deliverable**: Live backend serving requests

#### NLP Team
- **Files**: `nlp/models/`
- **Tasks**: 
  - Package trained models + final evaluation
- **Deliverable**: Deployed sentiment & summary models

#### Project Manager
- **Files**: `docs/meeting_notes.md`, `docs/demo_script.md`
- **Tasks**: 
  - Prepare presentation + coordinate final demo
- **Deliverable**: Smooth final showcase

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Git

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd StockScope_Skel

# Frontend setup
cd frontend
npm install
npm start

# Backend setup
cd ../backend
pip install -r requirements.txt
python app.py

# NLP setup
cd ../nlp
pip install -r requirements.txt
```

## Development Guidelines

1. **Code Reviews**: All PRs require at least one team member review -> PM review.
2. **Testing**: Write tests for new features
3. **Documentation**: Update docs when adding new features - notify PM via Slack or Meeting for official documentation changes.
4. **API Keys**: Never commit API keys to repository.
5. **Branching**: Use feature branches for each new feature developed, "nlp-demofeature", assign team member pull review to merge to team branch "nlp", PM review to merge to main.

## Success Metrics

- **Week 1-2**: All services run locally
- **Week 3-4**: Real data integration working
- **Week 5-6**: Advanced features functional
- **Week 7-8**: Full integration complete
- **Week 9-10**: Production-ready deployment

## Team Communication

- **Halfpoint Standups**: Wednesdays ~ PM EST
- **Weekly Reviews**: Saturdays ~ PM EST
- **Slack Channel**: #sof-stockscope-project
- **Project Details**: Refer to Google Drive

---

*Last Updated: 9/24/25*
*Project Manager: Shruthi Arunkumar*
