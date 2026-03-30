def test_health(client):
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    js = r.get_json()
    assert js.get("status") == "healthy"


def test_hello(client):
    r = client.get("/api/v1/hello")
    assert r.status_code == 200
    js = r.get_json()
    assert js.get("status") == "success"

