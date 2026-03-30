import sys
import numpy as np
import pandas as pd
from joblib import Parallel, delayed
from db import get_connection, init_schema, fetch_metadata, fetch_sector_rules, fetch_daily_prices, save_network_edges
from rules import get_allowed_pairs
from stats_engine import test_granger

def evaluate_pair(lead_ticker, lag_ticker, prices_dict, alpha_adj):
    lead_ret = prices_dict.get(lead_ticker)
    lag_ret = prices_dict.get(lag_ticker)
    
    if lead_ret is None or lag_ret is None:
        return None
    
    # Inner join to align correctly on identical dates
    df_lead = lead_ret.to_frame(name='lead').join(lag_ret.to_frame(name='lag'), how='inner').dropna()
    
    if len(df_lead) < 30: 
        return None
        
    res = test_granger(df_lead['lead'].values, df_lead['lag'].values, max_lag=5)
    if res is None:
        return None
        
    # Filter for significance
    if res['p_value'] <= alpha_adj:
        # Calculate accuracy/confidence score for UI
        # Confidence logic: How much does it beat the corrected alpha?
        conf = max(0, (1 - (res['p_value'] / alpha_adj)) * 100)
        
        return (
            lead_ticker, 
            lag_ticker, 
            float(res['p_value']), 
            float(res['f_stat']), 
            int(res['lag']),
            float(res['correlation']),
            int(res['is_positive']),
            float(res['cointegration_p']),
            float(conf)
        )
    return None

def main():
    try:
        conn = get_connection()
    except Exception as e:
        print(f"ERROR connecting to DB: {e}", file=sys.stderr)
        sys.exit(1)
        
    # Scaling: Add new columns if needed 
    # The schema is now initialized safely inside init_schema for PostgreSQL
    init_schema(conn)
    
    print("Fetching metadata and rules...", file=sys.stderr)
    metadata_df = fetch_metadata(conn)
    rules_df = fetch_sector_rules(conn)
    
    if metadata_df.empty or rules_df.empty:
        print("Database is empty. Please run seed_db.py first.", file=sys.stderr)
        sys.exit(0)
        
    allowed_pairs = get_allowed_pairs(metadata_df, rules_df)
    allowed_pairs = allowed_pairs[:2500] # Expanded slice to find a richer set of relationships
    
    n_tests = len(allowed_pairs)
    # Reverting brutal Bonferroni correction to a standard High-Confidence Alpha (0.01) for the V1 Demo
    alpha_adj = 0.01
    print(f"Testing {n_tests} pairs in parallel... Alpha Threshold: {alpha_adj}", file=sys.stderr)
    
    prices_df = fetch_daily_prices(conn)
    prices_dict = {ticker: group.set_index('date')['log_return'] for ticker, group in prices_df.groupby('ticker')}
    
    # Scaling: Use n_jobs=-2 to keep one core free for OS/DB response
    results = Parallel(n_jobs=-2, verbose=0)(
        delayed(evaluate_pair)(lead, lag, prices_dict, alpha_adj) for lead, lag in allowed_pairs
    )
    
    significant_edges = [r for r in results if r is not None]
    
    # Sort results structurally by UI Confidence Score descending
    significant_edges.sort(key=lambda x: x[8], reverse=True)
    
    print(f"Found {len(significant_edges)} high-confidence relationships.", file=sys.stderr)
    
    if significant_edges:
        print("\n--- TOP PREDICTIVE SHOCKWAVES ---", file=sys.stderr)
        for edge in significant_edges[:20]: # Print Top 20 to Terminal
            lead, lag, p_val, f_stat, lag_days, corr, is_pos, coint_p, conf = edge
            direction = "🟢 Positive " if is_pos else "🔴 Inverse  "
            print(f"[{lead} -> {lag}] Lag: {lag_days} Days | {direction} | Confidence: {conf:.1f}% | Cointegration P-Val: {coint_p:.2e}", file=sys.stderr)
        print("---------------------------------\n", file=sys.stderr)

        with conn:
            with conn.cursor() as cur:
                cur.execute("TRUNCATE TABLE network_edges RESTART IDENTITY;") # Refresh run PostgreSQL syntax
        
        # We can reuse the scalable save_network_edges function from db.py
        save_network_edges(conn, significant_edges)
        
    conn.close()

    print("Pipeline execution complete.", file=sys.stderr)

if __name__ == "__main__":
    main()
