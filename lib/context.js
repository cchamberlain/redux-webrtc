'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = configureContext;

var _chai = require('chai');

var _validate = require('./validate');

var _log = require('./log');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @typedef {Object} LibOpts
 * @property {string} libName the name of the library.
 * @property {function(context: LibContext): AppValidator} createValidator
 */

/**
 * @typedef {function(opts: AppOpts)} AppValidator
 */

/**
 * @typedef {Object} AppOpts
 * @property {string} appName the name of the application.
 */

/**
 * @typedef {Object} LibContext
 * @property {string} libName the name of the library.
 * @property {string} appName the name of the application.
 * @property {string} actionNames the names of the defined actions (ordered).
 */

/**
 * @typedef {LibAction[]} LibActions
 */

/**
 * @typedef {Array} LibAction
 */

/**
 * @typedef {Object} LibContext
 * @property {string[]} actionNames the names of all the actions (ordered).
 */

/**
 * @typedef CreateContext
 * @type {function(appOpts: AppOpts): AppContext }
 */

var noop = function noop() {};
var cleanActionName = function cleanActionName(name) {
  return name.toUpperCase().replace(/-+\s+/, '_');
};
var configureActionName = function configureActionName(libName) {
  return function (appName) {
    return function (actionName) {
      return cleanActionName(libName) + '_' + cleanActionName(appName) + '_' + cleanActionName(actionName);
    };
  };
};

/** Validates library creators options */
var validateLibOpts = function validateLibOpts(libOptsRaw) {
  _chai.assert.ok(libOptsRaw, 'libOpts definition is required');
  var libName = libOptsRaw.libName;
  var libActions = libOptsRaw.libActions;
  var validateContext = libOptsRaw.validateContext;
  var configureAppContext = libOptsRaw.configureAppContext;
  var configureInitialState = libOptsRaw.configureInitialState;

  (0, _chai.assert)(typeof libName === 'string', 'libName must be a string');
  (0, _chai.assert)(libName.length > 0, 'libName must not be empty');

  _chai.assert.ok(libActions, 'libActions must exist');
  (0, _chai.assert)(Array.isArray(libActions), 'libActions must be an array');
  (0, _chai.assert)(libActions.every(function (x) {
    return Array.isArray(x);
  }), 'libActions must be an array of an array');
  (0, _chai.assert)(libActions.every(function (x) {
    return x.length === 2;
  }), 'every item in libActions must have length 2');
  (0, _chai.assert)(libActions.every(function (x) {
    return typeof x[0] === 'string';
  }), 'every item in libActions must have first ordinal type string action name');
  (0, _chai.assert)(libActions.every(function (x) {
    return _typeof(x[1]) === 'object';
  }), 'every item in libActions must have second ordinal type object actionContext');

  _chai.assert.ok(validateContext, 'validateContext must exist');
  (0, _chai.assert)(typeof validateContext === 'function', 'validateContext must be a function');

  _chai.assert.ok(configureAppContext, 'configureAppContext must exist');
  (0, _chai.assert)(typeof configureAppContext === 'function', 'configureAppContext must be a function');

  _chai.assert.ok(configureInitialState, 'configureInitialState must exist');
  (0, _chai.assert)(typeof configureInitialState === 'function', 'configureInitialState must be a function');
};

/** Validates library consumers options */
var validateAppOpts = function validateAppOpts(appOptsRaw) {
  _chai.assert.ok(appOptsRaw, 'appOpts are required');
  var appName = appOptsRaw.appName;


  (0, _chai.assert)(typeof appName === 'string', 'appName opt must be a string');
  (0, _chai.assert)(appName.length > 0, 'appName opt must not be empty');
};

var validateAppContext = function validateAppContext(context) {};

var isDev = process.env.NODE_ENV !== 'production';

var normalizeLibOpts = function normalizeLibOpts(libOptsRaw) {
  if (isDev) validateLibOpts(libOptsRaw);
  var libName = libOptsRaw.libName;
  var libActions = libOptsRaw.libActions;
  var validateContext = libOptsRaw.validateContext;
  var configureAppContext = libOptsRaw.configureAppContext;
  var configureInitialState = libOptsRaw.configureInitialState;


  var libActionMap = new Map(libActions);
  var libActionNames = libActions.map(function (x) {
    return x[0];
  });
  var validateAgainstLibOpts = function validateAgainstLibOpts(appOptsRaw) {
    (0, _chai.assert)(appOptsRaw.appActions.every(function (x) {
      return !libActionNames.includes(x[0]);
    }), 'action names must be unique across lib and app');
  };
  return { libName: libName,
    libActions: libActions,
    libActionMap: libActionMap,
    libActionNames: libActionNames,
    validateContext: validateContext,
    configureAppContext: configureAppContext,
    configureInitialState: configureInitialState,
    validateAgainstLibOpts: validateAgainstLibOpts
  };
};
var normalizeAppOpts = function normalizeAppOpts(appOptsRaw) {
  if (isDev) validateAppOpts(appOptsRaw);
  var appName = appOptsRaw.appName;
  var appActions = appOptsRaw.appActions;

  return _extends({}, appOptsRaw, { appActionMap: new Map(appActions),
    appActionNames: appActions.map(function (x) {
      return x[0];
    })
  });
};
/*
import configureContext from 'redux-addons/context'
const context = configureContext(libOpts)(appOpts)
const {  } = context
 */
function configureContext(libOptsRaw) {
  var libOpts = normalizeLibOpts(libOptsRaw);
  var libName = libOpts.libName;
  var libActions = libOpts.libActions;
  var libActionMap = libOpts.libActionMap;
  var libActionNames = libOpts.libActionNames;
  var validateContext = libOpts.validateContext;
  var configureAppContext = libOpts.configureAppContext;
  var configureInitialState = libOpts.configureInitialState;
  var validateAgainstLibOpts = libOpts.validateAgainstLibOpts;

  return function (appOptsRaw) {
    if (isDev) validateAgainstLibOpts(appOptsRaw);
    var appOpts = normalizeAppOpts(appOptsRaw);
    var appName = appOpts.appName;
    var appActions = appOpts.appActions;
    var appActionMap = appOpts.appActionMap;
    var appActionNames = appOpts.appActionNames;
    var level = appOpts.level;


    var actions = [].concat(_toConsumableArray(libActions), _toConsumableArray(appActions));
    var actionMap = new Map(actions);
    var actionNames = actions.map(function (x) {
      return x[0];
    });

    var createActionType = function createActionType(actionName) {
      return cleanActionName(libName) + '_' + cleanActionName(appName) + '_' + cleanActionName(actionName);
    };
    var typedLibActions = libActions.map(function (x) {
      return [createActionType(x[0]), x[1]];
    });
    var typedAppActions = appActions.map(function (x) {
      return [createActionType(x[0]), x[1]];
    });
    var libActionTypes = typedLibActions.map(function (x) {
      return x[0];
    });
    var appActionTypes = typedAppActions.map(function (x) {
      return x[0];
    });
    var typedActions = [].concat(_toConsumableArray(typedLibActions), _toConsumableArray(typedAppActions));
    var typedActionMap = new Map(typedActions);
    var actionTypes = typedActions.map(function (x) {
      return x[0];
    });

    var getActionType = function getActionType(actionName) {
      return actionTypes[actionNames.indexOf(actionName)];
    };

    var getActionContextByName = function getActionContextByName(actionName) {
      return actionMap.get(actionName);
    };
    var getActionContextByType = function getActionContextByType(actionType) {
      return typedActionMap.get(actionType);
    };
    var getLibActionContextByOrdinal = function getLibActionContextByOrdinal(ordinal) {
      return libActions[ordinal][1];
    };
    var getAppActionContextByOrdinal = function getAppActionContextByOrdinal(ordinal) {
      return appActions[ordinal][1];
    };

    var libContext = { log: (0, _log.createLogger)({ libName: libName, level: level }),
      libName: libName,
      libActions: libActions,
      libActionMap: libActionMap,
      libActionNames: libActionNames,
      appName: appName,
      appActions: appActions,
      appActionMap: appActionMap,
      appActionNames: appActionNames,
      actions: actions,
      actionMap: actionMap,
      actionNames: actionNames,
      createActionType: createActionType,
      typedLibActions: typedLibActions,
      typedAppActions: typedAppActions,
      libActionTypes: libActionTypes,
      appActionTypes: appActionTypes,
      typedActions: typedActions,
      typedActionMap: typedActionMap,
      actionTypes: actionTypes,
      getActionType: getActionType,
      getActionContextByName: getActionContextByName,
      getActionContextByType: getActionContextByType,
      getLibActionContextByOrdinal: getLibActionContextByOrdinal,
      getAppActionContextByOrdinal: getAppActionContextByOrdinal
    };

    var appContext = configureAppContext(libContext)(appOpts);
    if (process.env.NODE_ENV !== 'production') {
      validateAppContext(appContext);
      validateContext(libContext, appContext);
    }

    return Object.assign(appContext, libContext, { get initialState() {
        return configureInitialState(libContext)(appContext);
      }
    });
  };
}