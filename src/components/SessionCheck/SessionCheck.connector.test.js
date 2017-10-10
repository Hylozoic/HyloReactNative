import { mapStateToProps, mapDispatchToProps } from './SessionCheck.connector.js'

jest.mock('react-native-onesignal', () => ({
  getPermissionSubscriptionState: jest.fn(() => Promise.resolve({userId: 5}))
}))

const defaultState = {
  session: {
    loggedIn: true
  },
  pending: {}
}

describe('mapStateToProps', () => {
  it('returns the right keys', () =>
    expect(mapStateToProps(defaultState)).toMatchSnapshot())
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
