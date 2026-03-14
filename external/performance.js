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
