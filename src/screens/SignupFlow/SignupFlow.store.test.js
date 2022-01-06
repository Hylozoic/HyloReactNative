import reducer, {
  MODULE_NAME,
  SIGNUP,
  UPDATE_LOCAL_USER_SETTINGS,
  signup,
  updateLocalUserSettings,
  getLocalUserSettings,
  getSignupErrors
} from './SignupFlow.store'

describe('reducer', () => {
  describe('on SIGNUP', () => {
    const state = {
      errors: {
        email: 'No good email'
      }
    }
    const action = {
      type: SIGNUP
    }

    it('clears errors', () => {
      expect(reducer(state, action))
        .toEqual({
          errors: {}
        })
    })
  })

  describe('on SIGNUP with email error', () => {
    const state = {
      errors: {
        email: 'No good email'
      }
    }
    const action = {
      type: SIGNUP,
      error: true,
      payload: {
        response: {
          body: 'That email address is already in use'
        }
      }
    }

    it('sets the email error', () => {
      expect(reducer(state, action))
        .toEqual({
          errors: {
            email: 'That address is already in use. Try logging in instead.'
          }
        })
    })
  })

  describe('on UPDATE_LOCAL_USER_SETTINGS', () => {
    const state = {
      userSettings: {
        name: 'Jones',
        email: 'jones@home.com'
      }
    }
    const action = {
      type: UPDATE_LOCAL_USER_SETTINGS,
      payload: {
        email: 'zeus@olympus.com',
        location: 'home'
      }
    }

    it('updates those settings', () => {
      expect(reducer(state, action))
        .toEqual({
          userSettings: {
            name: 'Jones',
            email: 'zeus@olympus.com',
            location: 'home'
          }
        })
    })
  })
})

describe('action generators', () => {
  describe('signup', () => {
    const params = {
      name: 'a', email: 'b', password: 'c'
    }
    it('matches snapshot', () => expect(signup(params)).toMatchSnapshot())
  })

  describe('updateLocalUserSettings', () => {
    const params = {
      name: 'a', email: 'b', password: 'c'
    }
    it('matches snapshot', () => expect(updateLocalUserSettings(params)).toMatchSnapshot())
  })
})

describe('pseudo selectors', () => {
  const state = {
    [MODULE_NAME]: {
      userSettings: {
        name: 'joe'
      },
      errors: {
        email: 'Bad email'
      }
    }
  }

  describe('getLocalUserSettings', () => {
    it('returns the userSettings', () => {
      expect(getLocalUserSettings(state))
        .toEqual(state[MODULE_NAME].userSettings)
    })
  })

  describe('getSignupErrors', () => {
    it('returns the errors', () => {
      expect(getSignupErrors(state))
        .toEqual(state[MODULE_NAME].errors)
    })
  })
})
