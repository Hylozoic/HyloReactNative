import reducer, {
  MODULE_NAME,
  SIGNUP,
  UPDATE_LOCAL_USER_SETTINGS,
  SET_SIGNUP_STEP1_COMPLETE,
  signup,
  updateLocalUserSettings,
  updateUserSettings,
  setSignupStep1Complete,
  getUserSettings,
  getSignupErrors,
  getSignupStep1Complete
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

  describe('on SET_SIGNUP_STEP1_COMPLETE', () => {
    const state = {
      signupStep1Complete: false
    }
    const action = {
      type: SET_SIGNUP_STEP1_COMPLETE,
      payload: true
    }

    it('sets signupStep1Complete', () => {
      expect(reducer(state, action))
      .toEqual({
        signupStep1Complete: true
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

  describe('updateUserSettings', () => {
    const params = {
      name: 'a', email: 'b', password: 'c'
    }
    it('matches snapshot', () => expect(updateUserSettings(params)).toMatchSnapshot())
  })

  describe('setSignupStep1Complete', () => {
    it('matches snapshot', () => expect(setSignupStep1Complete(true)).toMatchSnapshot())
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
      },
      signupStep1Complete: true
    }
  }

  describe('getUserSettings', () => {
    it('returns the userSettings', () => {
      expect(getUserSettings(state))
      .toEqual(state[MODULE_NAME].userSettings)
    })
  })

  describe('getSignupErrors', () => {
    it('returns the errors', () => {
      expect(getSignupErrors(state))
      .toEqual(state[MODULE_NAME].errors)
    })
  })

  describe('getSignupStep1Complete', () => {
    it('returns the status', () => {
      expect(getSignupStep1Complete(state))
      .toEqual(state[MODULE_NAME].signupStep1Complete)
    })
  })
})
