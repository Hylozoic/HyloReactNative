import sessionReducer from './sessionReducer'
import { LOGIN } from 'screens/Login/actions'
import { 
  CHECK_SESSION_AND_SET_SIGNED_IN,
  FETCH_CURRENT_USER,
  SELECT_COMMUNITY
} from 'store/constants'

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

describe('on SELECT_COMMUNITY', () => {
  it('returns the payload', () => {
    const state = {
    }
    const action = {
      type: SELECT_COMMUNITY,
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
                community: {
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
})
