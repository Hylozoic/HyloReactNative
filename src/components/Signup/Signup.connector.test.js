import { mapStateToProps, mapDispatchToProps } from './Signup.connector'

describe('mapStateToProps', () => {
  it('maps the state... to the props', () => {
    const state = {
      session: {
        loginError: 'oops'
      },
      pending: {}
    }

    const props = {
      navigation: {
        navigate: jest.fn()
      }
    }

    const newProps = mapStateToProps(state, props)
    expect(newProps.error).toEqual('oops')
    newProps.goToSignupFlow()
    newProps.goToLogin()
    expect(props.navigation.navigate).toHaveBeenCalled()
    expect(props.navigation.navigate.mock.calls)
      .toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('matches the last snapshot', () => {
    expect(mapDispatchToProps)
      .toMatchSnapshot()
  })
})
