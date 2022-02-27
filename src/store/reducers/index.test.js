import { createInitialState } from 'store'
import { RESET_STORE } from 'store/constants'
import appReducers, { KEYS_PRESERVED_ON_RESET, rootReducer } from 'store/reducers'

it('sets up the expected reducers', () => {
  const action = { type: 'HELLO_WORLD', payload: 'hello world' }
  expect(appReducers({}, action)).toMatchSnapshot()
})

it('preserves necessary state on reset', () => {
  const initialState = createInitialState()
  const preservedState = { [KEYS_PRESERVED_ON_RESET[0]]: 'foo' }
  const notPreservedState = { randomkey: 'foo' }
  const action = { type: RESET_STORE }
  const newState = rootReducer({
    ...preservedState,
    ...notPreservedState
  }, action)
  expect(newState).toMatchObject(preservedState)
  expect(newState).not.toMatchObject(notPreservedState)
  expect(newState).toEqual({
    ...initialState,
    ...preservedState
  })
})
