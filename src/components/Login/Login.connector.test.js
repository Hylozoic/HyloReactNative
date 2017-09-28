import { mapStateToProps, mapDispatchToProps } from './Login.connector'

jest.mock('react-native-google-signin', () => {})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      session: {
        loginError: 'blah',
        defaultLoginEmail: 'lah@lah.com'
      }
    }
    const props = {
      navigation: {
        navigate: jest.fn()
      }
    }
    const newProps = mapStateToProps(state, props)
    expect(newProps).toMatchSnapshot()
    newProps.goToSignup()
    expect(props.navigation.navigate).toHaveBeenCalled()
    expect(props.navigation.navigate.mock.calls)
    .toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = jest.fn(val => val)
    const dispatchProps = mapDispatchToProps(dispatch)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.loginWithFacebook('token')
    expect(dispatch).toHaveBeenCalled()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})
