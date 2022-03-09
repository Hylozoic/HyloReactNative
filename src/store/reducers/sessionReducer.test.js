import sessionReducer, { initialState } from './sessionReducer'
import { LOGIN } from 'screens/Login/actions'
import { 
  FETCH_CURRENT_USER,
  LOGOUT,
  SELECT_GROUP
} from 'store/constants'
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

  it('sets signedIn and resets errors', () => {
    const action = {
      type: LOGIN,
      payload: { id: '7' },
      meta: {
        email: 'foo@bar.com'
      }
    }
    expect(sessionReducer({ loginError: 'oh noes!' }, action)).toEqual({
      signedIn: true,
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
  it('preserves session.returnToPath on logout', () => {
    sessionReducer(createInitialState(), {})
    const returnToPath = 'path/to/return/to'
    const state = { returnToPath }
    const action = { type: LOGOUT }
    const newState = sessionReducer(state, action)
    expect(newState.returnToPath).toEqual(returnToPath)
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

describe('on FETCH_CURRENT_USER', () => {
  it('handles a user with a membership', () => {
    const state = {
      id: 1
    }
    const action = {
      type: FETCH_CURRENT_USER,
      payload: {
        data: {
          me: {
            memberships: [
              {
                group: {
                  id: 34
                }
              }
            ]
          }
        }
      }
    }
    expect(sessionReducer(state, action))
      .toMatchSnapshot()
  })

  it('handles a user with no memberships', () => {
    const state = {
      id: 1
    }
    const action = {
      type: FETCH_CURRENT_USER,
      payload: {
        data: {
          me: {
            memberships: []
          }
        }
      }
    }
    expect(sessionReducer(state, action))
      .toMatchSnapshot()
  })

  it('handles a not signed-in', () => {
    const state = {
      id: 1
    }
    const action = {
      type: FETCH_CURRENT_USER,
      payload: {
        data: {
          me: null
        }
      }
    }
    expect(sessionReducer(state, action))
      .toMatchSnapshot()
  })
})
