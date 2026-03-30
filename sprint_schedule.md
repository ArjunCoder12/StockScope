# Uptick: 2-Week Sprint Task List

This document acts as the primary task execution and tracking checklist for the two-week development sprint. Engineers must tick off their respective task boxes upon completion.

---

## Week 1: Establishing the Core Engine Pipeline

### Developer A (Algorithm & Signals)
- [ ] **Task 1 (Days 1-2):** Code a standalone 50-stock Sandbox to mathematically prove Transfer Entropy, NetworkX Pruning, and HMM Regime Detection function safely on a micro scale.
- [ ] **Task 2 (Days 3-4):** Integrate the `NetworkX` directed graph directly into the `main.py` pipeline to permanently prune all false-positive indirect shockwaves from the raw outputs.
- [ ] **Task 3 (Day 5):** Verify the `nx.algorithms.dag.transitive_reduction` outputs manually to ensure zero cascading mathematical loops (Time Loops) bypassed the DAG filter.

### Developer B (Performance & Vectorization)
- [ ] **Task 1 (Days 1-2):** Fork `stats_engine.py` and rewrite the slow Pandas `.join()` iterators inside the inner loops into pure C-backed NumPy vectorization.
- [ ] **Task 2 (Days 3-4):** Execute a full 500-stock chunk test (`250,000` pairs) natively on the server using the new vectorization. **Goal:** Under 10 minutes total computation time.
- [ ] **Task 3 (Day 5):** Implement Rolling Window Caching so the entire matrix math engine only updates with the newest daily closing prices, rather than blinding recalculating 6 full months.

### Developer C (Systems & Architecture)
- [ ] **Task 1 (Days 1-2):** Architect the native server `cron` job that will trigger the `main.py` Python orchestrator every single day at exactly 4:15 PM EST.
- [ ] **Task 2 (Days 3-4):** Completely strip `sqlite3` from `db.py` and securely map `psycopg2` / `sqlalchemy` to the external PostgreSQL production database instance.
- [ ] **Task 3 (Day 5):** Code the Automated Write-Back pipeline so `main.py` cleanly executes an `INSERT/UPDATE` of the calculated data perfectly into the newly created `ml_propagation_edges` Postgres table.

*(Milestone: By the end of Week 1, the baseline V2 Regime is actively running on the production server silently, writing its logic to Postgres).*

---

## Week 2: Advanced Upgrades & Integration

### Developer A (Algorithm & Signals)
- [ ] **Task 4 (Days 6-7):** Merge the fully trained `hmmlearn` ML model into the active pipeline. Tell the engine to dynamically adjust lag mathematical lengths based on the S&P 500 VIX state.
- [ ] **Task 5 (Days 8-9):** Attempt to hook the `jpype1` JVM module into the live processing loop to calculate Information Theory (Transfer Entropy). If it leaks memory globally, isolate it and permanently revert to the flawless Week 1 build.
- [ ] **Task 6 (Day 10):** Code Freeze. Final algorithmic sign-off.

### Developer B (Performance & Vectorization)
- [ ] **Task 4 (Days 6-7):** Revise the computational weighting logic inside `rules.py` to artificially prioritize and surface *Cross-Sector* predictive pairings over obvious *In-Sector* dragging.
- [ ] **Task 5 (Days 8-9):** Conduct full-scale, end-to-end memory stress testing on the server to heavily profile RAM spikes during the `hmmlearn` and Vectorization burst execution phases.
- [ ] **Task 6 (Day 10):** Code Freeze. Complete any final performance optimization tweaks before the 4:00 PM EST launch.

### Developer C (Systems & Architecture)
- [ ] **Task 4 (Days 6-7):** Expand the PostgreSQL `ml_propagation_edges` schema to structurally accept the new UI fallback columns: Market Beta, Sector Beta, and Regime Type.
- [ ] **Task 5 (Days 8-9):** Build and aggressively lock down the REST API endpoints that will securely serve the structured PostgreSQL table metrics over to the Frontend React team.
- [ ] **Task 6 (Day 10):** Code Freeze. Final authorization token review and V2 production deployment.
