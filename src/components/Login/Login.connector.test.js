import { mapDispatchToProps, mapStateToProps } from './Login.connector'
import OneSignal from 'react-native-onesignal'

jest.mock('react-native-onesignal', () => ({
  // eslint-disable-next-line standard/no-callback-literal
  getPermissionSubscriptionState: jest.fn(callback => callback({userId: 5})),
  addEventListener: jest.fn(),
  registerForPushNotifications: jest.fn(),
  inFocusDisplaying: jest.fn()
}))

jest.mock('react-native-device-info')

const props = {}

describe('mapStateToProps', () => {
  it('returns a default email from the session', () => {
    const email = 'email@hylo.com'
    const state = {
      session: {
        defaultLoginEmail: email
      },
      pending: {}
    }
    expect(mapStateToProps(state, props).defaultEmail).toBe(email)
  })

  describe('pending', () => {
    it('is truthy if pending', () => {
      const LOGIN = 'LOGIN'

      const state = {
        session: {},
        pending: {
          LOGIN
        }
      }
      expect(mapStateToProps(state, props).pending).toBeTruthy()
    })
    it('is falsey if not pending', () => {
      const state = {
        session: {},
        pending: {}
      }
      expect(mapStateToProps(state, props).pending).toBeFalsy()
    })
  })
})

describe('mapDispatchToProps', () => {
  let dispatch, dispatchProps

  beforeEach(() => {
    dispatch = jest.fn(x => Promise.resolve(x))
    dispatchProps = mapDispatchToProps(dispatch, props)
  })

  it('has loginWithFacebook', () => {
    expect(dispatchProps.loginWithFacebook('token')).toMatchSnapshot()
  })

  it('has loginWithGoogle', () => {
    expect(dispatchProps.loginWithGoogle('token')).toMatchSnapshot()
  })

  it('has login', () => {
    const username = 'name'
    const password = 'pass'
    expect(dispatchProps.login(username, password)).toMatchSnapshot()
  })

  it('maps the action generators', () => {
    expect(dispatchProps).toMatchSnapshot()
    return dispatchProps.loginWithFacebook('token')
    .then(() => {
      expect(dispatch).toHaveBeenCalled()
      expect(dispatch.mock.calls).toMatchSnapshot()

      expect(OneSignal.registerForPushNotifications).toBeCalled()
    })
  })
})
