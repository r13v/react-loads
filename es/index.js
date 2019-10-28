import { useRef, useEffect, useCallback, createContext, useState, useMemo, createElement, useContext, useReducer } from 'react';
import { func, array } from 'prop-types';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function useDetectMounted() {
  var hasMounted = useRef(true);
  useEffect(function () {
    return function cleanup() {
      hasMounted.current = false;
    };
  }, []);
  return hasMounted;
}

function useTimeout() {
  var timeout = useRef(undefined);

  var _setTimeout = useCallback(function (fn, ms) {
    // @ts-ignore
    timeout.current = setTimeout(fn, ms);
  }, []);

  var _clearTimeout = useCallback(function () {
    return clearTimeout(timeout.current);
  }, []);

  useEffect(function () {
    return function cleanup() {
      if (timeout) {
        clearTimeout(timeout.current);
      }
    };
  }, []);
  return [_setTimeout, _clearTimeout];
}

var LOAD_POLICIES = {
  CACHE_FIRST: 'cache-first',
  CACHE_AND_LOAD: 'cache-and-load',
  LOAD_ONLY: 'load-only'
};
var STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  TIMEOUT: 'timeout',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

function StateComponent(state) {
  return function (_ref, loader) {
    var children = _ref.children,
        or = _ref.or;

    if (state) {
      // @ts-ignore
      return typeof children === 'function' ? children(loader) : children;
    }

    if (or) {
      var newOr = or;

      if (!Array.isArray(or)) {
        newOr = [or];
      }

      if (newOr.length === 0) return null;
      newOr = _toConsumableArray(newOr);
      var Component = newOr.shift();
      return Component({
        children: children,
        or: newOr
      });
    }

    return null;
  };
}

var LoadsContext = createContext({
  cache: {
    records: {},
    get: function get() {},
    set: function set() {},
    reset: function reset() {}
  }
});
function Provider(_ref) {
  var children = _ref.children,
      cacheProvider = _ref.cacheProvider;

  var _React$useState = useState({}),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      records = _React$useState2[0],
      setRecords = _React$useState2[1];

  var reset = useCallback(function (opts) {
    setRecords({});

    var _cacheProvider = opts && opts.cacheProvider ? opts.cacheProvider : cacheProvider;

    if (_cacheProvider) {
      _cacheProvider.reset();
    }

    return;
  }, [cacheProvider]);
  var set = useCallback(function (key, val, opts) {
    setRecords(function (currentRecords) {
      return _objectSpread({}, currentRecords, _defineProperty({}, key, val));
    });

    var _cacheProvider = opts && opts.cacheProvider ? opts.cacheProvider : cacheProvider;

    if (_cacheProvider) {
      _cacheProvider.set(key, val);
    }

    return;
  }, [cacheProvider]);
  var get = useCallback(function (key, opts) {
    // First, check to see if the record exists in the context cache.
    var record = records[key];

    if (record) {
      return record;
    } // Otherwise, fallback to the cache provider.


    var _cacheProvider = opts && opts.cacheProvider ? opts.cacheProvider : cacheProvider;

    if (_cacheProvider) {
      var _value = _cacheProvider.get(key);

      if (_value) {
        return _value;
      }
    }

    return undefined;
  }, [cacheProvider, records]);
  var value = useMemo(function () {
    return {
      cache: {
        records: records,
        get: get,
        set: set,
        reset: reset
      }
    };
  }, [get, records, reset, set]);
  return createElement(LoadsContext.Provider, {
    value: value
  }, children);
}
var LoadsContext$1 = _objectSpread({}, LoadsContext, {
  Provider: Provider
});

function useLoads(fn) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var inputs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var cacheProvider = config.cacheProvider,
      _config$delay = config.delay,
      delay = _config$delay === void 0 ? 0 : _config$delay,
      _config$enableBackgro = config.enableBackgroundStates,
      enableBackgroundStates = _config$enableBackgro === void 0 ? false : _config$enableBackgro,
      _config$defer = config.defer,
      defer = _config$defer === void 0 ? false : _config$defer,
      _config$loadPolicy = config.loadPolicy,
      loadPolicy = _config$loadPolicy === void 0 ? LOAD_POLICIES.CACHE_AND_LOAD : _config$loadPolicy,
      _config$throwError = config.throwError,
      throwError = _config$throwError === void 0 ? false : _config$throwError,
      _config$timeout = config.timeout,
      timeout = _config$timeout === void 0 ? 0 : _config$timeout,
      updateFn = config.update;
  var id = Array.isArray(config.id) ? config.id.join('.') : config.id;
  var contextKey = config.id ? "".concat(config.context, ".").concat(id) : config.context;
  var globalContext = useContext(LoadsContext);
  var counter = useRef(0);
  var hasMounted = useDetectMounted();

  var _useTimeout = useTimeout(),
      _useTimeout2 = _slicedToArray(_useTimeout, 2),
      setDelayTimeout = _useTimeout2[0],
      clearDelayTimeout = _useTimeout2[1];

  var _useTimeout3 = useTimeout(),
      _useTimeout4 = _slicedToArray(_useTimeout3, 2),
      setTimeoutTimeout = _useTimeout4[0],
      clearTimeoutTimeout = _useTimeout4[1];

  function reducer(state, action) {
    switch (action.type) {
      case STATES.IDLE:
        return {
          state: STATES.IDLE
        };

      case STATES.PENDING:
        return _objectSpread({}, state, {
          state: STATES.PENDING
        });

      case STATES.TIMEOUT:
        return _objectSpread({}, state, {
          state: STATES.TIMEOUT
        });

      case STATES.RESOLVED:
        return {
          isCached: action.isCached,
          error: undefined,
          response: action.response,
          state: STATES.RESOLVED
        };

      case STATES.REJECTED:
        return {
          isCached: action.isCached,
          error: action.error,
          response: undefined,
          state: STATES.REJECTED
        };

      default:
        return state;
    }
  }

  var cachedRecord = useMemo(function () {
    if (contextKey) {
      return globalContext.cache.get(contextKey, {
        cacheProvider: cacheProvider
      });
    }

    return;
  }, [cacheProvider, contextKey, globalContext.cache]);
  var initialRecord = {
    state: STATES.IDLE
  };

  if (cachedRecord && !defer && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
    initialRecord = cachedRecord;
  }

  var _React$useReducer = useReducer(reducer, initialRecord),
      _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
      record = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  function handleData(data, state, count) {
    if (hasMounted.current && count === counter.current) {
      // @ts-ignore
      clearDelayTimeout(); // @ts-ignore

      clearTimeoutTimeout();
      dispatch({
        type: state,
        isCached: Boolean(contextKey),
        error: state === STATES.REJECTED ? data.error : undefined,
        response: state === STATES.RESOLVED ? data.response : undefined
      });

      if (contextKey) {
        var _record = {
          error: data.error,
          response: data.response,
          state: state
        };
        globalContext.cache.set(contextKey, _record, {
          cacheProvider: cacheProvider
        });
      }
    }
  }

  function handleOptimisticData(_ref, state, count) {
    var data = _ref.data,
        optsOrCallback = _ref.optsOrCallback,
        callback = _ref.callback;
    var newData = data;
    var opts = {};

    if (_typeof(optsOrCallback) === 'object') {
      opts = optsOrCallback;
    }

    if (typeof data === 'function') {
      var cachedValue;

      if (record.response) {
        cachedValue = record.response;
      } else if (opts.context) {
        cachedValue = globalContext.cache.get(opts.context, {
          cacheProvider: cacheProvider
        }) || {};
      }

      newData = data(cachedValue);
    }

    var value = {
      error: state === STATES.REJECTED ? newData : undefined,
      response: state === STATES.RESOLVED ? newData : undefined
    };

    if (!opts.context || contextKey === opts.context) {
      handleData(value, state, count);
    } else {
      if (globalContext.cache) {
        globalContext.cache.set(opts.context, _objectSpread({}, value, {
          state: state
        }), {
          cacheProvider: cacheProvider
        });
      }
    }

    var newCallback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;
    newCallback && newCallback(newData);
  }

  function load(opts) {
    return function () {
      for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
        _args[_key] = arguments[_key];
      }

      var args = _args.filter(function (arg) {
        return arg.constructor.name !== 'Class';
      });

      if (config.args && (!args || args.length === 0)) {
        args = config.args;
      }

      counter.current = counter.current + 1;
      var count = counter.current;

      if (contextKey && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
        if (cachedRecord) {
          dispatch(_objectSpread({
            type: cachedRecord.state,
            isCached: true
          }, cachedRecord));
          if (loadPolicy === LOAD_POLICIES.CACHE_FIRST) return;
        }
      }

      if (delay > 0) {
        setDelayTimeout(function () {
          return dispatch({
            type: STATES.PENDING
          });
        }, delay);
      } else {
        dispatch({
          type: STATES.PENDING
        });
      }

      if (timeout > 0) {
        setTimeoutTimeout(function () {
          return dispatch({
            type: STATES.TIMEOUT
          });
        }, timeout);
      }

      var loadFn = opts && opts.fn ? opts.fn : fn;
      return loadFn.apply(void 0, _toConsumableArray(args).concat([{
        cachedRecord: cachedRecord,
        setResponse: function setResponse(data, optsOrCallback, callback) {
          return handleOptimisticData({
            data: data,
            optsOrCallback: optsOrCallback,
            callback: callback
          }, STATES.RESOLVED, count);
        },
        setError: function setError(data, optsOrCallback, callback) {
          return handleOptimisticData({
            data: data,
            optsOrCallback: optsOrCallback,
            callback: callback
          }, STATES.REJECTED, count);
        }
      }])).then(function (response) {
        handleData({
          response: response
        }, STATES.RESOLVED, count);
        return response;
      }).catch(function (err) {
        handleData({
          error: err
        }, STATES.REJECTED, count);

        if (throwError) {
          throw err;
        }
      });
    };
  }

  var update = useMemo(function () {
    if (!updateFn) return;

    if (Array.isArray(updateFn)) {
      return updateFn.map(function (fn) {
        return load({
          fn: fn
        });
      });
    }

    return load({
      fn: updateFn
    });
  }, [updateFn] // eslint-disable-line react-hooks/exhaustive-deps
  );
  var reset = useCallback(function () {
    dispatch({
      type: STATES.IDLE
    });
  }, []);
  useEffect(function () {
    if (!cachedRecord && contextKey) {
      reset();
    }
  }, [cachedRecord, contextKey] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(function () {
    if (cachedRecord && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
      dispatch(_objectSpread({
        type: cachedRecord.state,
        isCached: true
      }, cachedRecord));
    }
  }, [cachedRecord, loadPolicy, dispatch]);
  useEffect(function () {
    if (defer) return;
    load()();
  }, [defer, contextKey, !inputs ? fn : undefined].concat(_toConsumableArray(inputs)) // eslint-disable-line react-hooks/exhaustive-deps
  );
  var states = {
    isIdle: record.state === STATES.IDLE && Boolean(!record.response || enableBackgroundStates),
    isPending: record.state === STATES.PENDING && Boolean(!record.response || enableBackgroundStates),
    isTimeout: record.state === STATES.TIMEOUT && Boolean(!record.response || enableBackgroundStates),
    isResolved: record.state === STATES.RESOLVED || Boolean(record.response),
    isRejected: record.state === STATES.REJECTED
  };
  return useMemo(function () {
    return _objectSpread({
      load: load(),
      update: update,
      reset: reset,
      response: record.response,
      error: record.error,
      state: record.state
    }, states, {
      Idle: StateComponent(states.isIdle),
      Pending: StateComponent(states.isPending),
      Timeout: StateComponent(states.isTimeout),
      Resolved: StateComponent(states.isResolved),
      Rejected: StateComponent(states.isRejected),
      isCached: Boolean(record.isCached)
    });
  }, [record.response, record.error, record.state, record.isCached, states, update] // eslint-disable-line react-hooks/exhaustive-deps
  );
}

var StateContext = createContext({
  isIdle: false,
  isPending: false,
  isTimeout: false,
  isResolved: false,
  isRejected: false
});
var Loads = function Loads(_ref) {
  var children = _ref.children,
      load = _ref.load,
      inputs = _ref.inputs,
      props = _objectWithoutProperties(_ref, ["children", "load", "inputs"]);

  var loader = useLoads(load, props, inputs || []);
  return createElement(StateContext.Provider, {
    value: loader
  }, typeof children === 'function' ? children(loader) : children);
};
Loads.propTypes = {
  children: func.isRequired,
  load: func.isRequired,
  inputs: array
};
Loads.defaultProps = {
  inputs: []
};

Loads.Idle = function (props) {
  return createElement(StateContext.Consumer, null, function (loader) {
    return StateComponent(loader.isIdle)(props, loader);
  });
};

Loads.Pending = function (props) {
  return createElement(StateContext.Consumer, null, function (loader) {
    return StateComponent(loader.isPending)(props, loader);
  });
};

Loads.Timeout = function (props) {
  return createElement(StateContext.Consumer, null, function (loader) {
    return StateComponent(loader.isTimeout)(props, loader);
  });
};

Loads.Resolved = function (props) {
  return createElement(StateContext.Consumer, null, function (loader) {
    return StateComponent(loader.isResolved)(props, loader);
  });
};

Loads.Rejected = function (props) {
  return createElement(StateContext.Consumer, null, function (loader) {
    return StateComponent(loader.isRejected)(props, loader);
  });
};

function useLoadsCache(contextKey) {
  var context = useContext(LoadsContext);
  var record = context.cache.get(contextKey);
  return record;
}

/* ====== START: SUSPENDER CREATOR ====== */
var STATES$1 = STATES;
var records = new Map();

function createLoadsSuspender(opts) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$preload = _ref.preload,
      preload = _ref$preload === void 0 ? false : _ref$preload;

  var loader = opts.load;

  if (Array.isArray(opts.load)) {
    loader = opts.load[0];
  }

  return function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref2.id,
        _ref2$args = _ref2.args,
        args = _ref2$args === void 0 ? [] : _ref2$args;

    var key = opts._namespace;

    if (id) {
      key = "".concat(key, ".").concat(id);
    }

    var record = records.get(key);
    if (typeof loader !== 'function') throw new Error('TODO');
    var promise = loader.apply(void 0, _toConsumableArray(args));

    if (record === undefined) {
      record = {
        state: STATES$1.PENDING,
        promise: promise
      };
      records.set(key, record);
    }

    promise.then(function (response) {
      record = {
        state: STATES$1.RESOLVED,
        response: response
      };
      records.set(key, record);
    }).catch(function (error) {
      record = {
        state: STATES$1.REJECTED,
        error: error
      };
      records.set(key, record);
    });

    if (!preload) {
      if (record.state === STATES$1.PENDING) {
        throw record.promise;
      }

      if (record.state === STATES$1.RESOLVED && record.response) {
        return record.response;
      }

      if (record.state === STATES$1.REJECTED) {
        throw record.error;
      }
    }

    return undefined;
  };
}
/* ====== END: SUSPENDER CREATOR ====== */

/* ====== START: HOOK CREATOR ====== */


function createLoadsHook(loader, config, opts) {
  return function (loadsConfig, inputs) {
    return useLoads(loader, _objectSpread({
      context: opts._namespace
    }, config, loadsConfig), inputs);
  };
}

function createLoadsHooks(opts) {
  return Object.entries(opts).reduce(function (currentLoaders, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        loadKey = _ref4[0],
        val = _ref4[1];

    if (loadKey[0] === '_' || typeof val === 'string') return currentLoaders;
    var loader = val;
    var config = {};

    if (Array.isArray(val)) {
      loader = val[0];
      config = val[1] || {};
    }

    if (loadKey === 'load') {
      return _objectSpread({}, currentLoaders, {
        useLoads: createLoadsHook(loader, config, opts)
      });
    }

    config = _objectSpread({}, config, {
      enableBackgroundStates: true
    });
    return _objectSpread({}, currentLoaders, _defineProperty({}, loadKey, {
      useLoads: createLoadsHook(loader, config, opts)
    }));
  }, {});
}
/* ====== END: HOOK CREATOR ====== */


function createResource(opts) {
  return _objectSpread({}, createLoadsHooks(opts), {
    unstable_load: createLoadsSuspender(opts),
    unstable_preload: createLoadsSuspender(opts, {
      preload: true
    })
  });
}

export { Loads, LoadsContext$1 as LoadsContext, Provider, useLoads, useLoadsCache, createResource };
