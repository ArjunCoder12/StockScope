import pandas as pd
import numpy as np
import yfinance as yf
from db import get_connection, init_schema
import sys
import requests
from lxml import html
from psycopg2.extras import execute_values

def fetch_sp500_tickers():
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    tree = html.fromstring(response.content)
    
    # Extract the table rows
    rows = tree.xpath('//table[@id="constituents"]/tbody/tr')[1:] # Skip header row
    
    records = []
    for row in rows:
        symbol = row.xpath('./td[1]//text()')
        symbol = symbol[0].strip() if symbol else ""
        
        security = row.xpath('./td[2]//text()')
        security = security[0].strip() if security else ""
        
        sector = row.xpath('./td[3]//text()')
        sector = sector[0].strip() if sector else ""
        
        sub_industry = row.xpath('./td[4]//text()')
        sub_industry = sub_industry[0].strip() if sub_industry else ""
        
        if symbol:
            records.append({
                'ticker': symbol,
                'company_name': security,
                'sector': sector,
                'sub_industry': sub_industry
            })
            
    return pd.DataFrame(records)

def seed():
    try:
        conn = get_connection()
    except Exception as e:
        print(f"ERROR: Cannot connect to DB: {e}")
        sys.exit(1)
        
    init_schema(conn)
    
    print("Fetching S&P 500 company info from Wikipedia using lxml scraper...")
    sp500_df = fetch_sp500_tickers()
    
    # Prune dual-class duplicate shares that mathematically break the Lead-Lag engine (Multicollinearity)
    BANNED_TICKERS = ['NWS', 'NWSA', 'GOOG', 'FOX', 'DISCK', 'UHAL.B']
    sp500_df = sp500_df[~sp500_df['ticker'].isin(BANNED_TICKERS)]
    
    # Replacing dot for yfinance compat
    sp500_df['yf_ticker'] = sp500_df['ticker'].str.replace('.', '-', regex=False)
    
    tickers = sp500_df['ticker'].tolist()
    yf_tickers = sp500_df['yf_ticker'].tolist()
    
    print("Inserting metadata into DB...")
    with conn:
        with conn.cursor() as cur:
            # PostgreSQL cascading truncate to wipe tables completely
            cur.execute("TRUNCATE TABLE daily_prices CASCADE;")
            cur.execute("TRUNCATE TABLE network_edges CASCADE;")
            cur.execute("TRUNCATE TABLE sector_rules CASCADE;")
            cur.execute("TRUNCATE TABLE stock_metadata CASCADE;")
            
            # Insert metadata using fast executing_values
            meta_data_values = sp500_df[['ticker', 'company_name', 'sector', 'sub_industry']].values.tolist()
            execute_values(cur,
                """
                INSERT INTO stock_metadata (ticker, company_name, sector, sub_industry) 
                VALUES %s
                ON CONFLICT (ticker) DO NOTHING
                """,
                meta_data_values
            )
            
            # Insert sector rules
            print("Inserting sector rules...")
            rules = [
                ('Information Technology', 'Communication Services'),
                ('Energy', 'Industrials'),
                ('Financials', 'Real Estate'),
                ('Health Care', 'Health Care'),
                ('Information Technology', 'Information Technology') # Intra-sector
            ]
            execute_values(cur,
                "INSERT INTO sector_rules (lead_sector, lag_sector) VALUES %s",
                rules
            )
    
    print("Downloading 6 months of daily prices using yfinance for ~500 stocks...")
    data = yf.download(yf_tickers, period="6mo", interval="1d", group_by="ticker", threads=True, auto_adjust=True)
    
    price_records = []
    
    print("Processing pricing data and calculating log returns...")
    for i, ticker in enumerate(tickers):
        yf_ticker = yf_tickers[i]
        if yf_ticker in data.columns.levels[0]:
            df = data[yf_ticker].copy()
            df = df.dropna(subset=['Close'])
            if len(df) > 10:
                df['log_return'] = np.log(df['Close'] / df['Close'].shift(1))
                df = df.dropna(subset=['log_return'])
                for date, row in df.iterrows():
                    open_price = float(row.get('Open', row['Close']))
                    if pd.isna(open_price): open_price = float(row['Close'])
                    
                    high_price = float(row.get('High', row['Close']))
                    if pd.isna(high_price): high_price = float(row['Close'])
                    
                    low_price = float(row.get('Low', row['Close']))
                    if pd.isna(low_price): low_price = float(row['Close'])
                    
                    vol = float(row.get('Volume', 0))
                    if pd.isna(vol): vol = 0.0
                    
                    price_records.append((
                        ticker,
                        str(date.date()),
                        open_price,
                        high_price,
                        low_price,
                        float(row['Close']),
                        vol,
                        float(row['log_return'])
                    ))
                    
    print(f"Batch inserting {len(price_records)} daily price records into PostgreSQL...")
    with conn:
        with conn.cursor() as cur:
            execute_values(cur,
                """
                INSERT INTO daily_prices (ticker, date, open, high, low, close, volume, log_return)
                VALUES %s
                ON CONFLICT (ticker, date) DO NOTHING
                """,
                price_records
            )
    
    print("Seed complete successfully.")

if __name__ == '__main__':
    seed()
