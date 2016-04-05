import createContext from './context'

import { createReducer } from './reducer'
import { createActions, defineAction } from './actions'
import { createMiddleware } from './middleware'

export { defineAction }

export default function configure(opts) {
  const context = createContext(opts)
  return  { reducer: createReducer(context)
          , actions: createActions(context)
          , middleware: createMiddleware(context)
          }
}
