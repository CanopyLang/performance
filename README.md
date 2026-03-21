# canopy/performance

Performance marks, measures, navigation and resource timing, and Core Web Vitals for Canopy applications.

## Installation

```
canopy install canopy/performance
```

## Core Concept

The package wraps the browser's `Performance` API. There are two ways to read timing data: a one-shot snapshot via `Performance.getEntries` (or `Performance.now`), and a live stream via `Performance.Observer.observe`. For ongoing monitoring — such as tracking layout shifts or paint events as they occur — use the observer. For benchmarking a specific code path, place marks around the work, call `measure`, then read the entry.

## Quick Start

```canopy
import Performance
import Performance.Observer
import Performance.Vitals


-- Measure a specific operation
startLoad : Cmd msg
startLoad =
    Performance.mark "data-load-start"


endLoad : Cmd msg
endLoad =
    Cmd.batch
        [ Performance.mark "data-load-end"
        , Performance.measure "data-load" "data-load-start" "data-load-end"
        ]


-- Observe Core Web Vitals
subscriptions : Model -> Sub Msg
subscriptions _ =
    Performance.Vitals.observe GotVital
```

## Modules

### Performance

The root module covers high-resolution timestamps, marks, and measures.

| Name | Type | Description |
|------|------|-------------|
| `Performance.now` | `Task x Float` | Current time as a `DOMHighResTimeStamp` in milliseconds since the navigation start |
| `Performance.mark` | `String -> Cmd msg` | Record a named timestamp in the browser's performance timeline |
| `Performance.measure` | `String -> String -> String -> Cmd msg` | Record the elapsed time between two named marks under a new name |
| `Performance.getEntries` | `Task x (List Entry)` | Snapshot all current entries in the performance timeline |
| `Performance.clearMarks` | `Maybe String -> Cmd msg` | Remove named marks, or all marks if `Nothing` |
| `Performance.clearMeasures` | `Maybe String -> Cmd msg` | Remove named measures, or all measures if `Nothing` |

### Performance.Entry

Types and accessors for individual timeline entries.

| Name | Type | Description |
|------|------|-------------|
| `Entry.name` | `Entry -> String` | The name given to the mark or measure |
| `Entry.entryType` | `Entry -> EntryType` | The kind of entry |
| `Entry.startTime` | `Entry -> Float` | When the entry began, in milliseconds |
| `Entry.duration` | `Entry -> Float` | How long the entry lasted, in milliseconds |

**`EntryType`** — `Mark | Measure | Navigation | Resource | Paint | LayoutShift | LargestContentfulPaint | FirstInput`

### Performance.Observer

Live entry monitoring as a subscription.

| Name | Type | Description |
|------|------|-------------|
| `Performance.Observer.observe` | `List EntryType -> (List Entry -> msg) -> Sub msg` | Subscribe to new entries of the specified types as they are recorded |

### Performance.Navigation

Navigation timing for the current page load.

| Name | Type | Description |
|------|------|-------------|
| `Performance.Navigation.get` | `Task x NavigationEntry` | Retrieve the navigation timing entry for the current document |
| `NavigationEntry.domContentLoaded` | `NavigationEntry -> Float` | Time to `DOMContentLoaded` in milliseconds |
| `NavigationEntry.loadEvent` | `NavigationEntry -> Float` | Time to the `load` event in milliseconds |
| `NavigationEntry.type_` | `NavigationEntry -> NavigationType` | How the page was loaded |

**`NavigationType`** — `Navigate | Reload | BackForward | Prerender`

### Performance.Resource

Per-resource timing for assets loaded by the page.

| Name | Type | Description |
|------|------|-------------|
| `Performance.Resource.getAll` | `Task x (List ResourceEntry)` | All resource timing entries in the current buffer |
| `ResourceEntry.initiatorType` | `ResourceEntry -> String` | What initiated the request (e.g. `"fetch"`, `"img"`, `"script"`) |
| `ResourceEntry.transferSize` | `ResourceEntry -> Int` | Bytes transferred over the network |
| `ResourceEntry.encodedBodySize` | `ResourceEntry -> Int` | Compressed body size in bytes |

### Performance.Vitals

Core Web Vitals as a subscription.

| Name | Type | Description |
|------|------|-------------|
| `Performance.Vitals.observe` | `(VitalsMeasurement -> msg) -> Sub msg` | Receive a message each time a Core Web Vital is recorded |

**`VitalsMeasurement`** — A record carrying `name : String`, `value : Float`, `rating : Rating`, and `navigationType : NavigationType`.

**`Rating`** — `Good | NeedsImprovement | Poor`

## Gotchas

**`Performance.now` returns milliseconds, not seconds.** The value has sub-millisecond precision (typically microsecond resolution), but the unit is always milliseconds relative to the start of the current navigation — not the Unix epoch.

**`Performance.getEntries` is a snapshot.** Entries added after the task resolves will not appear in the result. For continuously arriving entries such as resource loads or layout shifts, use `Performance.Observer.observe` instead.

**Marks and measures are global.** The browser's performance timeline is shared across all code running in the page. Use namespaced names (e.g. `"myapp/data-load-start"`) to avoid collisions with third-party scripts.

**Core Web Vitals measurements may arrive late or not at all.** Largest Contentful Paint and Cumulative Layout Shift are finalised only after the user interacts with the page or the page is hidden. Do not expect `Vitals.observe` to deliver values immediately on load.

## License

BSD-3-Clause
