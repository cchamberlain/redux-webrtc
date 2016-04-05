'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var noop = function noop() {};

var createLogger = exports.createLogger = function createLogger(_ref) {
  var libName = _ref.libName;
  var level = _ref.level;

  var _formatMessage = function _formatMessage(_ref2) {
    var level = _ref2.level;
    var message = _ref2.message;
    var obj = _ref2.obj;

    if (!message && typeof obj === 'string') {
      message = obj;
      obj = noop();
    }
    return _formatLog(obj ? level + ': \'' + message + '\' => ' + JSON.stringify(obj) : level + ': \'' + message + '\'');
  };

  var _formatLog = function _formatLog(message) {
    return libName + ' | ' + message;
  };

  return process.env.NODE_ENV !== 'production' ? { trace: function trace(obj, message) {
      return level === 'trace' ? console.trace(_formatMessage({ level: 'trace', message: message, obj: obj })) : noop();
    },
    debug: function debug(obj, message) {
      return ['trace', 'debug'].includes(level) ? console.log(_formatMessage({ level: 'debug', message: message, obj: obj })) : noop();
    },
    info: function info(obj, message) {
      return ['trace', 'debug', 'info'].includes(level) ? console.info(_formatMessage({ level: 'info', message: message, obj: obj })) : noop();
    },
    warn: function warn(obj, message) {
      return ['trace', 'debug', 'info', 'warn'].includes(level) ? console.warn(_formatMessage({ level: 'warn', message: message, obj: obj })) : noop();
    },
    error: function error(obj, message) {
      return ['trace', 'debug', 'info', 'warn', 'error'].includes(level) ? console.error(_formatMessage({ level: 'error', message: message, obj: obj })) : noop();
    }
  } : { trace: noop, debug: noop, info: noop, warn: noop, error: noop };
};