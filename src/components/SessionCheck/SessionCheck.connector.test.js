import { mapStateToProps, mapDispatchToProps } from './SessionCheck.connector.js'
import OneSignal from 'react-native-onesignal'
import { MODULE_NAME as SignupFlowStoreKey } from '../SignupFlow/SignupFlow.store'

jest.mock('react-native-device-info')
jest.mock('react-native-onesignal', () => ({
  // eslint-disable-next-line standard/no-callback-literal
  getPermissionSubscriptionState: jest.fn(callback => callback({userId: 5})),
  addEventListener: jest.fn(),
  registerForPushNotifications: jest.fn(),
  inFocusDisplaying: jest.fn()
}))

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const defaultState = {
      session: {
        loggedIn: true,
        entryURL: 'http://www.hylo.com/a/path'
      },
      pending: {},
      [SignupFlowStoreKey]: {}
    }
    expect(mapStateToProps(defaultState)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.checkSession()
    dispatchProps.initOneSignal()

    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
    expect(OneSignal.addEventListener).toBeCalled()
    expect(OneSignal.registerForPushNotifications).toBeCalled()
    expect(OneSignal.inFocusDisplaying).toBeCalled()
  })
})
