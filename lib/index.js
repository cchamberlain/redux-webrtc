'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.defineAction = undefined;
exports.default = configure;

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _reducer = require('./reducer');

var _actions = require('./actions');

var _middleware = require('./middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.defineAction = _actions.defineAction;
function configure(opts) {
        var context = (0, _context2.default)(opts);
        return { reducer: (0, _reducer.createReducer)(context),
                actions: (0, _actions.createActions)(context),
                middleware: (0, _middleware.createMiddleware)(context)
        };
}