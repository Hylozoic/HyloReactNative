import { getEmptyState } from 'store/reducers/resetStore'
import { LOGOUT, RESET_STORE } from 'store/constants'
import resetStore, { KEYS_PRESERVED_ON_RESET } from './resetStore'

describe('resetStore', () => {
  it('resets to initial state on logout', () => {
    const fullInitialState = resetStore(getEmptyState(), {})
    const state = { foo: 'bar' }
    const action = { type: LOGOUT }
    const newState = resetStore(state, action)
    expect(newState).toEqual(fullInitialState)
  })

  it('preserves session.returnToPath on logout', () => {
    resetStore(getEmptyState(), {})
    const returnToPath = 'path/to/return/to' 
    const state = { foo: 'bar', session: { returnToPath } }
    const action = { type: LOGOUT }
    const newState = resetStore(state, action)
    expect(newState.session.returnToPath).toEqual(returnToPath)
  })

  it('preserves necessary state on reset', () => {
    const fullInitialState = resetStore(getEmptyState(), {})
    const preservedState = { [KEYS_PRESERVED_ON_RESET[0]]: 'foo' }
    const notPreservedState = { randomkey: 'foo' }
    const action = { type: RESET_STORE }
    const newState = resetStore({
      ...preservedState,
      ...notPreservedState
    }, action)
    expect(newState).toMatchObject(preservedState)
    expect(newState).not.toMatchObject(notPreservedState)
    expect(newState).toEqual({
      ...fullInitialState,
      ...preservedState
    })
  })
})

describe('getEmptyState', () => {
  it('matches last snapshot', () => {
    expect(getEmptyState()).toMatchSnapshot()
  })
})
