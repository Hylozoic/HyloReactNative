import reducer, {
  MODULE_NAME,
  UPDATE_LOCAL_USER_SETTINGS,
  updateLocalUserSettings,
  getLocalUserSettings
} from './SignupFlow.store'

describe('reducer', () => {
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
})
