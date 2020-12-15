import sessionReducer from './sessionReducer'
import { CHECK_SESSION_AND_SET_SIGNED_IN } from 'store/constants'
import { LOGIN } from 'navigation/Login/actions'

describe('on CHECK_SESSION_AND_SET_SIGNED_IN', () => {
  it('stores the payload', () => {
    const action = {
      type: CHECK_SESSION_AND_SET_SIGNED_IN,
      payload: true
    }
    expect(sessionReducer({}, action)).toEqual({ signedIn: true })
  })
})

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
