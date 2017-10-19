import { mapStateToProps, mapDispatchToProps } from './SessionCheck.connector.js'
import registerDevice from '../../store/actions/registerDevice'
import { addEventListener, registerForPushNotifications } from 'react-native-onesignal'

jest.mock('react-native-device-info')
jest.mock('react-native-onesignal', () => ({
  // eslint-disable-next-line standard/no-callback-literal
  getPermissionSubscriptionState: jest.fn(callback => callback({userId: 5})),
  addEventListener: jest.fn(),
  registerForPushNotifications: jest.fn()
}))

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const defaultState = {
      session: {
        loggedIn: true,
        entryURL: 'http://www.hylo.com/a/path'
      },
      pending: {}
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
    expect(addEventListener).toBeCalled()
    expect(registerForPushNotifications).toBeCalled()
  })
})
