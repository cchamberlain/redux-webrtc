'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Lib Constants */
var LIB_NAME = exports.LIB_NAME = 'redux-idle-monitor';

/** Redux state root level key */
var ROOT_STATE_KEY = exports.ROOT_STATE_KEY = 'idle';

/** Redux Action Type Constants */
var ACTION_PREFIX = exports.ACTION_PREFIX = 'IDLEMONITOR';
var IDLEMONITOR_ACTIVITY = exports.IDLEMONITOR_ACTIVITY = ACTION_PREFIX + '_ACTIVITY';