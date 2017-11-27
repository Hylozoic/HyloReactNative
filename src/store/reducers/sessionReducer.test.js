import sessionReducer from './sessionReducer'
import { CHECK_INVITATION } from '../../components/JoinCommunity/JoinCommunity.store'
import { CHECK_SESSION } from '../../components/SessionCheck/SessionCheck.store'
import { LOGIN } from '../../components/Login/actions'

describe('on CHECK_INVITATION', () => {
  it('returns the payload', () => {
    const state = {}
    const action = {
      type: CHECK_INVITATION
    }
    expect(sessionReducer(state, action)).toEqual({hasSignupLink: true})
  })
})

describe('on CHECK_SESSION', () => {
  it('stores the payload', () => {
    const action = {
      type: CHECK_SESSION,
      payload: true
    }
    expect(sessionReducer({}, action)).toEqual({loggedIn: true})
  })
})

describe('on LOGIN', () => {
  it('stores an error message', () => {
    const action = {
      type: LOGIN,
      error: true,
      payload: {message: 'oh noes!'}
    }
    expect(sessionReducer({}, action)).toEqual({
      loginError: 'oh noes!'
    })
  })

  it('sets loggedIn and resets errors', () => {
    const action = {
      type: LOGIN,
      payload: {id: '7'},
      meta: {
        email: 'foo@bar.com'
      }
    }
    expect(sessionReducer({loginError: 'oh noes!'}, action)).toEqual({
      loggedIn: true,
      defaultLoginEmail: 'foo@bar.com'
    })
  })
})
