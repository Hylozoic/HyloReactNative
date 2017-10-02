import { mapStateToProps } from './Signup.connector'

describe('mapStateToProps', () => {
  it('maps the state... to the props', () => {
    const props = {
      navigation: {
        navigate: jest.fn()
      }
    }

    const newProps = mapStateToProps({}, props)
    newProps.goToSignupFlow()
    newProps.goToLogin()
    expect(props.navigation.navigate).toHaveBeenCalled()
    expect(props.navigation.navigate.mock.calls)
    .toMatchSnapshot()
  })
})
