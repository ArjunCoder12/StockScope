from app.fetchers import get_price_data

data = get_price_data("AAPL", "daily")
for date, price_info in list(data.items())[:3]:
    print(date, price_info)