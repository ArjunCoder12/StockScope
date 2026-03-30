# StockScope - Quick Start Guide

Get StockScope up and running in minutes!

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd StockScope
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

#Create a .env file in the backend directory and add the following
ALPHA_VANTAGE_API_KEY=your_api_key_here

# Start the Flask server
python app.py
```

**Backend should now be running on:** `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

**Frontend should now be running on:** `http://localhost:3000`

The app will automatically open in your browser

### Backend Health Check

```bash
curl http://localhost:5000/api/v1/hello
```

Expected response:

```json
{
  "message": "Hello from StockScope API!",
  "status": "success"
}
```

### Frontend

- Navigate to `http://localhost:3000`
- You should see the Dashboard with stock information
- Try searching for a ticker (e.g., AAPL, TSLA) in the navbar

## 📁 Project Structure

```
StockScope/
├── backend/          # Flask API server
│   ├── app/          # Application code
│   ├── data/         # Watchlist data
│   ├── tests/        # Backend tests
│   └── venv/         # Python virtual environment
├── frontend/         # React application
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── node_modules/ # Node dependencies
├── nlp/              # NLP sentiment analysis
│   ├── sentiment.py  # Sentiment analyzer
│   └── preprocessing.py
└── docs/             # Documentation
```

## Configuration

### Backend

- **Port:** 5000 (default)
- **API Base:** `/api/v1`

### Frontend

- **Port:** 3000 (default)
- **API Endpoint:** `http://localhost:5000/api/v1`

### Watchlist

Add or modify stocks in `backend/data/watchlist.json`:

```json
[
  {
    "ticker": "AAPL",
    "name": "Apple Inc."
  }
]
```

## Key Features (what should be the case)

- **Dashboard:** Overview of your watchlist stocks with real-time data
- **Stock Search:** Search any ticker symbol in the navbar
- **News Feed:** Latest news for each stock
- **Price Charts:** Interactive stock price visualizations
- **Responsive Design:** Works on desktop, tablet, and mobile

## Common Issues

### Backend won't start

- Check Python version: `python --version` (should be 3.13+)
- Ensure virtual environment is activated
- Try reinstalling dependencies: `pip install -r requirements.txt --force-reinstall`

### Frontend won't start

- Check Node version: `node --version` (should be 16+)
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check if port 3000 is already in use

### API requests failing

- Verify backend is running on port 5000
- Check browser console for CORS errors

### Stock data not loading

- Check that Alpha Vantage API key is configured (if required)
- Verify watchlist.json exists and has valid data
- Check backend logs for errors

## Data Caching

- **Stock List:** Cached for 1 minute
- **Chart Data:** Cached for 1 minute
- **Sentiment:** Cached for 1 minute
- **News:** Cached for 1 minute

## Additional Resources

## News

- **Current Error:** Currently the news does not properly load, and it should be fixed by the
  backend team.

- **API Documentation:** `docs/api_contract.md`
