import sys
import warnings
import numpy as np
import scipy.stats as stats
from statsmodels.tsa.stattools import grangercausalitytests, coint

def check_cointegration(series_1, series_2):
    """
    Checks if two series are cointegrated (share a long-term trend).
    This filters out 'spurious' correlations where both stocks just move with the market.
    Returns p_value of the Engle-Granger test.
    """
    try:
        # coint returns (t-stat, p-value, crit_values)
        _, p_val, _ = coint(series_1, series_2)
        return p_val
    except:
        return 1.0

def get_relationship_metrics(lead_returns, lag_returns):
    """
    Calculates the correlation (sign) and basic stats.
    Returns (correlation_coefficient, is_positive).
    """
    corr, _ = stats.pearsonr(lead_returns, lag_returns)
    return float(corr), bool(corr > 0)

def test_granger(lead_returns, lag_returns, max_lag=5):
    """
    Tests if lead_returns Granger-causes lag_returns.
    Returns (min_p_value, corresponding_f_stat, lag, correlation, is_positive, coint_p) or None.
    """
    if len(lead_returns) < 30 or len(lag_returns) < 30:
        return None
        
    # Accuracy Step 1: Check Cointegration (on price levels if possible, but returns work as proxy here)
    coint_p = check_cointegration(lead_returns, lag_returns)
    
    # Accuracy Step 2: Get Sign/Correlation
    corr, is_pos = get_relationship_metrics(lead_returns, lag_returns)
    
    data = np.column_stack((lag_returns, lead_returns))
    
    try:
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            res = grangercausalitytests(data, maxlag=max_lag, verbose=False)
            
        best_p, best_f, best_lag = 1.0, 0.0, 0
        
        for lag in range(1, max_lag + 1):
            if lag in res:
                f_test_result = res[lag][0]['ssr_ftest']
                p_val = f_test_result[1]
                if p_val < best_p:
                    best_p, best_f, best_lag = p_val, f_test_result[0], lag
                    
        return {
            'p_value': best_p,
            'f_stat': best_f,
            'lag': best_lag,
            'correlation': corr,
            'is_positive': is_pos,
            'cointegration_p': coint_p
        }
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return None
