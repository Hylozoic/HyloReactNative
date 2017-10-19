import { mapStateToProps, mapDispatchToProps } from './SessionCheck.connector.js'

jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
}))
jest.mock('react-native-device-info')

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
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
