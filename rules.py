import pandas as pd

def get_allowed_pairs(metadata_df, rules_df):
    """
    Returns a list of allowable (lead_ticker, lag_ticker) pairs based on sector_rules.
    Intra-sector pairs and inter-sector pairs specified in the rules_df are permitted.
    """
    leads = metadata_df.rename(columns={'ticker': 'lead_ticker', 'sector': 'lead_sector'})
    lags = metadata_df.rename(columns={'ticker': 'lag_ticker', 'sector': 'lag_sector'})
    
    # Cross join rules with leads, then with lags
    allowed_edges = rules_df.merge(leads, on='lead_sector').merge(lags, on='lag_sector')
    
    # Filter out self-loops (lead_ticker == lag_ticker)
    allowed_edges = allowed_edges[allowed_edges['lead_ticker'] != allowed_edges['lag_ticker']]
    
    # Returns a list of tuples: [(lead, lag), (lead, lag), ...]
    return list(zip(allowed_edges['lead_ticker'], allowed_edges['lag_ticker']))
