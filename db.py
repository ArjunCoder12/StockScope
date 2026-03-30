import psycopg2
import pandas as pd
from psycopg2.extras import execute_values

def get_connection():
    # Connect to the local PostgreSQL database hosted via Docker
    return psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="leadlag_db",
        user="uptick_user",
        password="uptick_password"
    )

def init_schema(conn):
    with conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS stock_metadata (
                    ticker TEXT PRIMARY KEY,
                    company_name TEXT,
                    sector TEXT,
                    sub_industry TEXT
                );
                
                CREATE TABLE IF NOT EXISTS daily_prices (
                    ticker TEXT,
                    date DATE,
                    open NUMERIC,
                    high NUMERIC,
                    low NUMERIC,
                    close NUMERIC,
                    volume NUMERIC,
                    log_return NUMERIC,
                    PRIMARY KEY (ticker, date),
                    FOREIGN KEY (ticker) REFERENCES stock_metadata(ticker)
                );
                
                CREATE TABLE IF NOT EXISTS sector_rules (
                    id SERIAL PRIMARY KEY,
                    lead_sector TEXT,
                    lag_sector TEXT
                );
                
                CREATE TABLE IF NOT EXISTS network_edges (
                    id SERIAL PRIMARY KEY,
                    lead_ticker TEXT,
                    lag_ticker TEXT,
                    p_value NUMERIC,
                    f_statistic NUMERIC,
                    lag_tested INTEGER,
                    correlation NUMERIC,
                    is_positive INTEGER,
                    cointegration_p NUMERIC,
                    confidence_score NUMERIC
                );
            """)

def fetch_metadata(conn):
    return pd.read_sql("SELECT ticker, sector, sub_industry FROM stock_metadata", conn)

def fetch_sector_rules(conn):
    return pd.read_sql("SELECT lead_sector, lag_sector FROM sector_rules", conn)

def fetch_daily_prices(conn):
    # Fetch data and ensure it's ordered by date.
    df = pd.read_sql("SELECT ticker, date, close, log_return FROM daily_prices ORDER BY date", conn)
    return df

def save_network_edges(conn, edges):
    if not edges:
        return
    with conn:
        with conn.cursor() as cur:
            execute_values(cur,
                """
                INSERT INTO network_edges (lead_ticker, lag_ticker, p_value, f_statistic, lag_tested, correlation, is_positive, cointegration_p, confidence_score)
                VALUES %s
                """,
                edges
            )
