import json as jsonlib
from unittest.mock import patch

import os


def test_watchlist_get_uses_persisted_file(client, tmp_path, monkeypatch):
    # point watchlist storage to a temp file
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    data_path = data_dir / "watchlist.json"
    data_path.write_text(jsonlib.dumps([{ "ticker": "ZZZ", "name": "ZZZ Corp" }]))

    import importlib
    mod = importlib.import_module("app.routes.watchlist")
    monkeypatch.setattr(mod, "DATA_DIR", str(data_dir))
    monkeypatch.setattr(mod, "DATA_PATH", str(data_path))

    resp = client.get("/api/v1/watchlist")
    assert resp.status_code == 200
    js = resp.get_json()
    assert any(x["ticker"] == "ZZZ" for x in js["data"])  # reflects temp file


def test_watchlist_post_add_and_update(client, tmp_path, monkeypatch):
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    data_path = data_dir / "watchlist.json"
    data_path.write_text("[]")

    import importlib
    mod = importlib.import_module("app.routes.watchlist")
    monkeypatch.setattr(mod, "DATA_DIR", str(data_dir))
    monkeypatch.setattr(mod, "DATA_PATH", str(data_path))

    # add
    r1 = client.post("/api/v1/watchlist", json={"ticker": "nvda", "name": "NVIDIA"})
    assert r1.status_code in (200, 201)
    # update
    r2 = client.post("/api/v1/watchlist", json={"ticker": "NVDA", "name": "NVIDIA Corporation"})
    assert r2.status_code == 200

    # verify list
    r3 = client.get("/api/v1/watchlist")
    items = r3.get_json()["data"]
    match = [x for x in items if x["ticker"] == "NVDA"]
    assert match and match[0]["name"] == "NVIDIA Corporation"


def test_watchlist_post_invalid_ticker(client):
    r = client.post("/api/v1/watchlist", json={"ticker": "AAPL1"})
    assert r.status_code == 400


def test_watchlist_delete(client, tmp_path, monkeypatch):
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    data_path = data_dir / "watchlist.json"
    data_path.write_text(jsonlib.dumps([{ "ticker": "MSFT", "name": "Microsoft" }]))

    import importlib
    mod = importlib.import_module("app.routes.watchlist")
    monkeypatch.setattr(mod, "DATA_DIR", str(data_dir))
    monkeypatch.setattr(mod, "DATA_PATH", str(data_path))

    r = client.delete("/api/v1/watchlist/MSFT")
    assert r.status_code == 200
    r2 = client.delete("/api/v1/watchlist/MSFT")
    assert r2.status_code == 404

