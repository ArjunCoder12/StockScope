def test_fundamentals_success(client):
    r = client.get("/api/v1/fundamentals/AAPL")
    assert r.status_code in (200, 404)  
   
    if r.status_code == 200:
        js = r.get_json()
        assert js["status"] == "success"
        assert js["data"]["ticker"] == "AAPL"


def test_fundamentals_invalid_len(client):
    r = client.get("/api/v1/fundamentals/TOOLONG")
    assert r.status_code == 400


def test_fundamentals_non_alpha(client):
    r = client.get("/api/v1/fundamentals/AAPL1")
    assert r.status_code == 400

