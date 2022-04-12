import sessionReducer, { initialState } from './sessionReducer'
import { LOGIN } from 'screens/Login/actions'
import { LOGOUT, SELECT_GROUP } from 'store/constants'
import { createInitialState } from 'store'

describe('on LOGIN', () => {
  it('stores an error message', () => {
    const action = {
      type: LOGIN,
      error: true,
      payload: { message: 'oh noes!' }
    }
    expect(sessionReducer({}, action)).toEqual({
      loginError: 'oh noes!'
    })
  })

  it('resets errors', () => {
    const action = {
      type: LOGIN,
      payload: { id: '7' },
      meta: {
        email: 'foo@bar.com'
      }
    }
    expect(sessionReducer({ loginError: 'oh noes!' }, action)).toEqual({
      defaultLoginEmail: 'foo@bar.com'
    })
  })
})

describe('on LOGOUT', () => {
  it('resets to initial state on logout', () => {
    const state = { foo: 'bar' }
    const action = {
      type: LOGOUT
    }
    const newState = sessionReducer(state, action)
    expect(newState).toEqual(initialState)
  })
  it('preserves session.returnToOnAuthPath on logout', () => {
    sessionReducer(createInitialState(), {})
    const returnToOnAuthPath = 'path/to/return/to'
    const state = { returnToOnAuthPath }
    const action = { type: LOGOUT }
    const newState = sessionReducer(state, action)
    expect(newState.returnToOnAuthPath).toEqual(returnToOnAuthPath)
  })
})

describe('on SELECT_GROUP', () => {
  it('returns the payload', () => {
    const state = {
    }
    const action = {
      type: SELECT_GROUP,
      payload: '123',
    }
    expect(sessionReducer(state, action))
      .toMatchSnapshot()
  })
})

