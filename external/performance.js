// Canopy Performance FFI — Performance API bindings
//
// Imported via:
//   foreign import javascript "external/performance.js" as PerformanceFFI


// ============================================================================
// MAYBE CONSTRUCTORS
// ============================================================================

var _Performance_nothing = __canopy_debug ? { $: 'Nothing' } : { $: 1 };

function _Performance_just(a) {
	return __canopy_debug ? { $: 'Just', a: a } : { $: 0, a: a };
}


// ============================================================================
// ENTRY CONSTRUCTORS
// ============================================================================

function _Performance_markEntry(m) {
	return __canopy_debug ? { $: 'MarkEntry', a: m } : { $: 0, a: m };
}

function _Performance_measureEntry(m) {
	return __canopy_debug ? { $: 'MeasureEntry', a: m } : { $: 1, a: m };
}

function _Performance_longTaskEntry(t) {
	return __canopy_debug ? { $: 'LongTaskEntry', a: t } : { $: 2, a: t };
}

function _Performance_layoutShiftEntry(s) {
	return __canopy_debug ? { $: 'LayoutShiftEntry', a: s } : { $: 3, a: s };
}

function _Performance_lcpEntry(l) {
	return __canopy_debug ? { $: 'LargestContentfulPaintEntry', a: l } : { $: 4, a: l };
}

function _Performance_eventEntry(e) {
	return __canopy_debug ? { $: 'EventEntry', a: e } : { $: 5, a: e };
}


// ============================================================================
// HIGH-RESOLUTION TIMESTAMPS
// ============================================================================

/**
 * Get a high-resolution timestamp via performance.now().
 * @canopy-type Task Never Float
 * @name now
 */
var now = _Scheduler_binding(function(callback) {
	callback(_Scheduler_succeed(performance.now()));
});


// ============================================================================
// MARKS
// ============================================================================

/**
 * Create a performance mark.
 * @canopy-type String -> Cmd msg
 * @name mark
 */
function mark(name) {
	return _Platform_leaf('Performance')({
		$: 'mark',
		_name: name
	});
}

/**
 * Create a performance mark with detail.
 * @canopy-type String -> Json.Encode.Value -> Cmd msg
 * @name markWithDetail
 */
var markWithDetail = F2(function(name, detail) {
	return _Platform_leaf('Performance')({
		$: 'markWithDetail',
		_name: name,
		_detail: detail
	});
});

/**
 * Clear marks by name.
 * @canopy-type String -> Cmd msg
 * @name clearMarks
 */
function clearMarks(name) {
	return _Platform_leaf('Performance')({
		$: 'clearMarks',
		_name: name
	});
}

/**
 * Clear all marks.
 * @canopy-type Cmd msg
 * @name clearAllMarks
 */
var clearAllMarks = _Platform_leaf('Performance')({
	$: 'clearAllMarks'
});

/**
 * Clear measures by name.
 * @canopy-type String -> Cmd msg
 * @name clearMeasures
 */
function clearMeasures(name) {
	return _Platform_leaf('Performance')({
		$: 'clearMeasures',
		_name: name
	});
}

/**
 * Clear all measures.
 * @canopy-type Cmd msg
 * @name clearAllMeasures
 */
var clearAllMeasures = _Platform_leaf('Performance')({
	$: 'clearAllMeasures'
});


// ============================================================================
// MEASURES
// ============================================================================

/**
 * Create a performance measure between two marks.
 * @canopy-type String -> String -> String -> Cmd msg
 * @name measure
 */
var measure = F3(function(name, startMark, endMark) {
	return _Platform_leaf('Performance')({
		$: 'measure',
		_name: name,
		_start: startMark,
		_end: endMark
	});
});

/**
 * Create a performance measure from a mark to now.
 * @canopy-type String -> String -> Cmd msg
 * @name measureFromMark
 */
var measureFromMark = F2(function(name, startMark) {
	return _Platform_leaf('Performance')({
		$: 'measureFromMark',
		_name: name,
		_start: startMark
	});
});

/**
 * Create a performance measure between two marks with detail.
 * @canopy-type String -> String -> String -> Json.Encode.Value -> Cmd msg
 * @name measureWithDetail
 */
var measureWithDetail = F4(function(name, startMark, endMark, detail) {
	return _Platform_leaf('Performance')({
		$: 'measureWithDetail',
		_name: name,
		_start: startMark,
		_end: endMark,
		_detail: detail
	});
});


// ============================================================================
// ENTRY CONVERSION
// ============================================================================

/**
 * Convert a raw PerformanceEntry to a Canopy Entry type.
 */
function _Performance_convertEntry(entry) {
	switch (entry.entryType) {
		case 'mark':
			return _Performance_markEntry({
				name: entry.name,
				startTime: entry.startTime,
				detail: entry.detail != null
					? _Performance_just(_Json_wrap(entry.detail))
					: _Performance_nothing
			});

		case 'measure':
			return _Performance_measureEntry({
				name: entry.name,
				startTime: entry.startTime,
				duration: entry.duration,
				detail: entry.detail != null
					? _Performance_just(_Json_wrap(entry.detail))
					: _Performance_nothing
			});

		case 'longtask':
			return _Performance_longTaskEntry({
				name: entry.name,
				startTime: entry.startTime,
				duration: entry.duration
			});

		case 'layout-shift':
			return _Performance_layoutShiftEntry({
				value: entry.value || 0,
				startTime: entry.startTime,
				hadRecentInput: entry.hadRecentInput || false
			});

		case 'largest-contentful-paint':
			return _Performance_lcpEntry({
				startTime: entry.startTime,
				renderTime: entry.renderTime || 0,
				loadTime: entry.loadTime || 0,
				size: entry.size || 0,
				element: entry.element
					? _Performance_just(entry.element.tagName || entry.element.nodeName || '')
					: _Performance_nothing,
				url: entry.url
					? _Performance_just(entry.url)
					: _Performance_nothing
			});

		case 'event':
			return _Performance_eventEntry({
				name: entry.name,
				startTime: entry.startTime,
				processingStart: entry.processingStart || 0,
				processingEnd: entry.processingEnd || 0,
				duration: entry.duration,
				interactionId: entry.interactionId || 0
			});

		default:
			// Treat unknown types as marks with zero detail
			return _Performance_markEntry({
				name: entry.name || entry.entryType,
				startTime: entry.startTime || 0,
				detail: _Performance_nothing
			});
	}
}

/**
 * Convert a list of raw entries to a Canopy List of Entry values.
 */
function _Performance_convertEntries(rawEntries) {
	var result = _List_Nil;
	for (var i = rawEntries.length - 1; i >= 0; i--) {
		result = _List_Cons(_Performance_convertEntry(rawEntries[i]), result);
	}
	return result;
}


// ============================================================================
// QUERYING
// ============================================================================

/**
 * Get entries by type from the performance timeline.
 * @canopy-type String -> Task Never (List Entry)
 * @name getEntries
 */
function getEntries(entryType) {
	return _Scheduler_binding(function(callback) {
		try {
			var entries = performance.getEntriesByType(entryType);
			callback(_Scheduler_succeed(_Performance_convertEntries(entries)));
		} catch(e) {
			callback(_Scheduler_succeed(_List_Nil));
		}
	});
}

/**
 * Get entries by name from the performance timeline.
 * @canopy-type String -> Task Never (List Entry)
 * @name getEntriesByName
 */
function getEntriesByName(name) {
	return _Scheduler_binding(function(callback) {
		try {
			var entries = performance.getEntriesByName(name);
			callback(_Scheduler_succeed(_Performance_convertEntries(entries)));
		} catch(e) {
			callback(_Scheduler_succeed(_List_Nil));
		}
	});
}


// ============================================================================
// NAVIGATION TIMING
// ============================================================================

/**
 * Get navigation timing for the current page.
 * @canopy-type Task Never (Maybe NavigationTiming)
 * @name getNavigationTiming
 */
var getNavigationTiming = _Scheduler_binding(function(callback) {
	try {
		var entries = performance.getEntriesByType('navigation');
		if (entries.length === 0) {
			callback(_Scheduler_succeed(_Performance_nothing));
			return;
		}
		var e = entries[0];
		callback(_Scheduler_succeed(_Performance_just({
			fetchStart: e.fetchStart || 0,
			domainLookupStart: e.domainLookupStart || 0,
			domainLookupEnd: e.domainLookupEnd || 0,
			connectStart: e.connectStart || 0,
			connectEnd: e.connectEnd || 0,
			secureConnectionStart: e.secureConnectionStart || 0,
			requestStart: e.requestStart || 0,
			responseStart: e.responseStart || 0,
			responseEnd: e.responseEnd || 0,
			domInteractive: e.domInteractive || 0,
			domContentLoadedEventStart: e.domContentLoadedEventStart || 0,
			domContentLoadedEventEnd: e.domContentLoadedEventEnd || 0,
			domComplete: e.domComplete || 0,
			loadEventStart: e.loadEventStart || 0,
			loadEventEnd: e.loadEventEnd || 0,
			transferSize: e.transferSize || 0,
			encodedBodySize: e.encodedBodySize || 0,
			decodedBodySize: e.decodedBodySize || 0
		})));
	} catch(e) {
		callback(_Scheduler_succeed(_Performance_nothing));
	}
});


// ============================================================================
// RESOURCE TIMING
// ============================================================================

/**
 * Get all resource timing entries.
 * @canopy-type Task Never (List ResourceTiming)
 * @name getResourceEntries
 */
var getResourceEntries = _Scheduler_binding(function(callback) {
	try {
		var entries = performance.getEntriesByType('resource');
		var result = _List_Nil;
		for (var i = entries.length - 1; i >= 0; i--) {
			var e = entries[i];
			result = _List_Cons({
				name: e.name,
				initiatorType: e.initiatorType || '',
				startTime: e.startTime,
				duration: e.duration,
				transferSize: e.transferSize || 0,
				encodedBodySize: e.encodedBodySize || 0,
				decodedBodySize: e.decodedBodySize || 0,
				responseStart: e.responseStart || 0,
				responseEnd: e.responseEnd || 0
			}, result);
		}
		callback(_Scheduler_succeed(result));
	} catch(e) {
		callback(_Scheduler_succeed(_List_Nil));
	}
});


// ============================================================================
// PERFORMANCE OBSERVER
// ============================================================================

/**
 * Create a PerformanceObserver and start observing.
 * @canopy-type List String -> Bool -> (List Entry -> Task Never ()) -> Task Never RawValue
 * @name createObserver
 */
var createObserver = F3(function(typeStrings, buffered, callback) {
	return _Scheduler_binding(function(done) {
		try {
			var types = _List_toArray(typeStrings);
			var observer = new PerformanceObserver(function(list) {
				var entries = _Performance_convertEntries(list.getEntries());
				_Scheduler_rawSpawn(callback(entries));
			});

			// Use separate observe calls per type when buffered,
			// since buffered requires the single-type 'type' option
			if (buffered) {
				for (var i = 0; i < types.length; i++) {
					try {
						observer.observe({ type: types[i], buffered: true });
					} catch(e) {
						// Some entry types may not be supported
					}
				}
			} else {
				try {
					observer.observe({ entryTypes: types });
				} catch(e) {
					// Fall back to individual observe calls
					for (var i = 0; i < types.length; i++) {
						try {
							observer.observe({ type: types[i] });
						} catch(e2) {
							// Skip unsupported types
						}
					}
				}
			}

			done(_Scheduler_succeed(observer));
		} catch(e) {
			// PerformanceObserver not supported
			done(_Scheduler_succeed(null));
		}
	});
});

/**
 * Disconnect a PerformanceObserver.
 * @canopy-type RawValue -> Task Never ()
 * @name disconnectObserver
 */
function disconnectObserver(observer) {
	return _Scheduler_binding(function(callback) {
		try {
			if (observer && observer.disconnect) {
				observer.disconnect();
			}
		} catch(e) {
			// Ignore errors during cleanup
		}
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


// ============================================================================
// CORE WEB VITALS
// ============================================================================

/**
 * Observe all Core Web Vitals (LCP, INP, CLS).
 * @canopy-type ((String, Float) -> msg) -> Sub msg
 * @name observeVitals
 */
function observeVitals(toMsg) {
	return _Platform_leaf('PerformanceVitals')({
		$: 'vitals',
		_toMsg: toMsg
	});
}

/**
 * Observe LCP only.
 * @canopy-type (Float -> msg) -> Sub msg
 * @name observeLcp
 */
function observeLcp(toMsg) {
	return _Platform_leaf('PerformanceVitals')({
		$: 'lcp',
		_toMsg: toMsg
	});
}

/**
 * Observe INP only.
 * @canopy-type (Float -> msg) -> Sub msg
 * @name observeInp
 */
function observeInp(toMsg) {
	return _Platform_leaf('PerformanceVitals')({
		$: 'inp',
		_toMsg: toMsg
	});
}

/**
 * Observe CLS only.
 * @canopy-type (Float -> msg) -> Sub msg
 * @name observeCls
 */
function observeCls(toMsg) {
	return _Platform_leaf('PerformanceVitals')({
		$: 'cls',
		_toMsg: toMsg
	});
}


// ============================================================================
// PERFORMANCE VITALS EFFECT MANAGER
//
// Registers a Canopy effect manager for the 'PerformanceVitals' subscription
// tag so that observeVitals / observeLcp / observeInp / observeCls actually
// set up PerformanceObserver instances and dispatch measurements to the app.
//
// INP algorithm: W3C spec (https://web.dev/inp/) requires the 98th-percentile
// interaction duration across all interactions on the page, not Math.max.
//
// CLS algorithm: W3C spec requires the session-window model — group consecutive
// layout shifts into windows separated by >1 s gaps or >5 s total length,
// then report the maximum session window score.
// ============================================================================


// --- Mutable effect-manager state -------------------------------------------

var _PerformanceVitals_started   = false;
var _PerformanceVitals_router    = null;
var _PerformanceVitals_currentSubs = [];
var _PerformanceVitals_observers = {};

// INP: accumulate all interaction durations; report 98th-percentile
var _PerformanceVitals_inpDurations = [];

// CLS session-window state
var _PerformanceVitals_clsSession   = null;  // { start, last, score }
var _PerformanceVitals_clsMaxScore  = 0;

// LCP: latest value (start time in ms)
var _PerformanceVitals_lcpValue = 0;


// --- INP: 98th-percentile computation ---------------------------------------

function _PerformanceVitals_computeInp()
{
	var durations = _PerformanceVitals_inpDurations;
	if (durations.length === 0) { return 0; }

	var sorted = durations.slice().sort(function(a, b) { return a - b; });

	// W3C: round down to the 98th-percentile index.  For a single entry that
	// index is 0 (i.e. the only entry), which is correct.
	var idx = Math.floor(0.98 * sorted.length);
	if (idx >= sorted.length) { idx = sorted.length - 1; }

	return sorted[idx];
}


// --- CLS: session-window algorithm ------------------------------------------

function _PerformanceVitals_processCls(entry)
{
	// Per the spec, shifts with recent user input are excluded.
	if (entry.hadRecentInput) { return; }

	var time  = entry.startTime;
	var value = entry.value || 0;

	var session = _PerformanceVitals_clsSession;

	if (session === null ||
	    time - session.last  > 1000 ||   // gap > 1 s → new window
	    time - session.start > 5000)      // duration > 5 s → new window
	{
		_PerformanceVitals_clsSession = { start: time, last: time, score: value };
	}
	else
	{
		session.last   = time;
		session.score += value;
	}

	if (_PerformanceVitals_clsSession.score > _PerformanceVitals_clsMaxScore)
	{
		_PerformanceVitals_clsMaxScore = _PerformanceVitals_clsSession.score;
	}
}


// --- Dispatcher: send a vital measurement to all matching subscribers --------

function _PerformanceVitals_dispatch(type, value)
{
	var router = _PerformanceVitals_router;
	if (!router) { return; }

	// Canopy Tuple2 for the 'vitals' subscription (mapVital expects this shape)
	var pair = { a: type, b: value };

	var subs = _PerformanceVitals_currentSubs;
	for (var i = 0; i < subs.length; i++)
	{
		var sub = subs[i];
		var tag = sub.$;

		if (tag === 'vitals')
		{
			// observeVitals receives (String, Float) tuple mapped through mapVital
			router.__sendToApp(sub._toMsg(pair));
		}
		else if (tag === 'lcp' && type === 'lcp')
		{
			router.__sendToApp(sub._toMsg(value));
		}
		else if (tag === 'inp' && type === 'inp')
		{
			router.__sendToApp(sub._toMsg(value));
		}
		else if (tag === 'cls' && type === 'cls')
		{
			router.__sendToApp(sub._toMsg(value));
		}
	}
}


// --- PerformanceObserver setup / teardown -----------------------------------

function _PerformanceVitals_startObservers()
{
	var obs = {};

	// LCP: always use the latest entry's startTime
	try
	{
		var lcpObs = new PerformanceObserver(function(list)
		{
			var entries = list.getEntries();
			if (entries.length > 0)
			{
				_PerformanceVitals_lcpValue = entries[entries.length - 1].startTime;
				_PerformanceVitals_dispatch('lcp', _PerformanceVitals_lcpValue);
			}
		});
		lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
		obs.lcp = lcpObs;
	}
	catch(e) {}

	// INP: collect event + first-input durations; report 98th percentile
	try
	{
		var eventObs = new PerformanceObserver(function(list)
		{
			var entries = list.getEntries();
			for (var i = 0; i < entries.length; i++)
			{
				var dur = entries[i].duration;
				if (dur > 0) { _PerformanceVitals_inpDurations.push(dur); }
			}
			var inp = _PerformanceVitals_computeInp();
			if (inp > 0) { _PerformanceVitals_dispatch('inp', inp); }
		});
		try { eventObs.observe({ type: 'event', durationThreshold: 16, buffered: true }); } catch(e) {}
		try { eventObs.observe({ type: 'first-input', buffered: true }); } catch(e) {}
		obs.event = eventObs;
	}
	catch(e) {}

	// CLS: session-window aggregation; report the running max
	try
	{
		var clsObs = new PerformanceObserver(function(list)
		{
			var entries = list.getEntries();
			for (var i = 0; i < entries.length; i++)
			{
				_PerformanceVitals_processCls(entries[i]);
			}
			_PerformanceVitals_dispatch('cls', _PerformanceVitals_clsMaxScore);
		});
		clsObs.observe({ type: 'layout-shift', buffered: true });
		obs.cls = clsObs;
	}
	catch(e) {}

	_PerformanceVitals_observers = obs;
}


function _PerformanceVitals_stopObservers()
{
	var obs = _PerformanceVitals_observers;
	try { if (obs.lcp)   { obs.lcp.disconnect();   } } catch(e) {}
	try { if (obs.event) { obs.event.disconnect(); } } catch(e) {}
	try { if (obs.cls)   { obs.cls.disconnect();   } } catch(e) {}
	_PerformanceVitals_observers  = {};
	_PerformanceVitals_inpDurations = [];
	_PerformanceVitals_clsSession   = null;
	_PerformanceVitals_clsMaxScore  = 0;
	_PerformanceVitals_lcpValue     = 0;
}


// --- Effect-manager callbacks ------------------------------------------------

function _PerformanceVitals_onEffects(router, subs, state)
{
	// Convert Canopy linked list to JS array
	var subList = [];
	for (var cur = subs; cur.b; cur = cur.b) { subList.push(cur.a); }

	_PerformanceVitals_currentSubs = subList;
	_PerformanceVitals_router      = router;

	if (subList.length > 0 && !_PerformanceVitals_started)
	{
		_PerformanceVitals_startObservers();
		_PerformanceVitals_started = true;
	}
	else if (subList.length === 0 && _PerformanceVitals_started)
	{
		_PerformanceVitals_stopObservers();
		_PerformanceVitals_started = false;
	}

	return _Scheduler_succeed(state);
}


function _PerformanceVitals_onSelfMsg(router, msg, state)
{
	return _Scheduler_succeed(state);
}


// Subscription mapper: lift (a -> b) over the _toMsg callback
var _PerformanceVitals_subMap = F2(function(tagger, sub)
{
	return {
		$: sub.$,
		_toMsg: function(value) { return tagger(sub._toMsg(value)); }
	};
});


// Register the effect manager so _Platform_leaf('PerformanceVitals') works
_Platform_effectManagers['PerformanceVitals'] = _Platform_createManager(
	_Scheduler_succeed(null),           // init
	F3(_PerformanceVitals_onEffects),   // onEffects
	F3(_PerformanceVitals_onSelfMsg),   // onSelfMsg
	0,                                  // no commands
	_PerformanceVitals_subMap           // subMap for Sub mapping
);
