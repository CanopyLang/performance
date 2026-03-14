# canopy/performance — TODO

## Status: Has Critical Stub (v1.0.0)

Performance measurement. Entry types, Navigation timing, Resource timing, Web Vitals. 6 modules.

---

## Critical: Fix Stub

- [ ] **`Performance.Observer.onEffects` and `onSelfMsg` are no-ops** — they always return `Task.succeed {}`. The subscription API (`observe`, `observeMany`) exists but never actually creates PerformanceObserver instances or delivers entries to subscribers. Implement the actual effect manager.

---

## Missing Features

- [ ] Add missing Entry filter functions: `filterLayoutShifts`, `filterLcpEntries`, `filterEvents` (only `filterMarks`/`filterMeasures`/`filterLongTasks` exist)
- [ ] Server timing API integration
- [ ] User timing level 3 support (mark with detail, structured options)
- [ ] Performance budget monitoring — alert when metrics exceed thresholds
- [ ] Performance reporting API integration
- [ ] `Performance.Profile` — CPU profiling helpers

---

## Test Improvements

- [ ] Good coverage for pure functions (130+ tests) — add integration tests for Observer once fixed
