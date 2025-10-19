import json
import os
from flask import Blueprint, jsonify, request

# CRUD-only JSON-backed watchlist routes (no pricing here)
watchlist_bp = Blueprint("watchlist", __name__)

# Persistence paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
DATA_PATH = os.path.join(DATA_DIR, "watchlist.json")

# Default seeds used on first run (and as a fallback)
DEFAULT_WATCHLIST = [
    {"ticker": "AAPL", "name": "Apple Inc."},
    {"ticker": "TSLA", "name": "Tesla Inc."},
    {"ticker": "GOOGL", "name": "Alphabet Inc."},
    {"ticker": "AMZN", "name": "Amazon.com Inc."},
    {"ticker": "MSFT", "name": "Microsoft Corporation"},
]


def _ensure_storage():
    # Ensure data directory exists and seed default file if missing
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_PATH):
        with open(DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_WATCHLIST, f, indent=2)


def load_watchlist():
    # Load and normalize the watchlist (uppercase, dedupe)
    _ensure_storage()
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

            norm = []
            seen = set()
            for item in data:
                t = (item.get("ticker") or "").upper()
                n = item.get("name") or t
                if not t or t in seen:
                    continue
                seen.add(t)
                norm.append({"ticker": t, "name": n})
            return norm
    except Exception:
        return DEFAULT_WATCHLIST


def save_watchlist(items):
    # Persist the provided list to disk
    _ensure_storage()
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)


@watchlist_bp.route("/watchlist", methods=["GET"])
def get_watchlist():
    # List current watchlist (ticker + name only)
    items = load_watchlist()
    return jsonify({"status": "success", "data": items}), 200


@watchlist_bp.route("/watchlist", methods=["POST"])
def add_watchlist_item():
    # Add or update an entry: {ticker, name}. Validates 1–5 letters.
    try:
        body = request.get_json(silent=True) or {}
        ticker = ((body.get("ticker") or "").strip()).upper()
        name = (body.get("name") or ticker).strip()
        if not ticker:
            return jsonify({"status": "error", "message": "ticker is required"}), 400
        if len(ticker) < 1 or len(ticker) > 5 or not ticker.isalpha():
            return jsonify({"status": "error", "message": "Ticker must be 1-5 letters"}), 400

        items = load_watchlist()
        updated = False
        for it in items:
            if it["ticker"] == ticker:
                it["name"] = name
                updated = True
                break
        if not updated:
            items.append({"ticker": ticker, "name": name})
        save_watchlist(items)
        return jsonify({"status": "success", "data": {"ticker": ticker, "name": name}, "updated": updated}), 201 if not updated else 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@watchlist_bp.route("/watchlist/<ticker>", methods=["DELETE"])
def delete_watchlist_item(ticker):
    # Remove an entry by ticker; returns 404 if not present
    try:
        ticker = (ticker or "").upper()
        items = load_watchlist()
        new_items = [it for it in items if it["ticker"] != ticker]
        if len(new_items) == len(items):
            return jsonify({"status": "error", "message": f"Ticker {ticker} not found"}), 404
        save_watchlist(new_items)
        return jsonify({"status": "success", "message": f"Removed {ticker}"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
