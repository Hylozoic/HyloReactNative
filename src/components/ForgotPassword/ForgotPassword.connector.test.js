import { mapDispatchToProps, mergeProps } from './ForgotPassword.connector'

jest.mock('react-native-device-info')

describe('mergeProps', () => {
  test('goToLogin', () => {
    const dispatchProps = mapDispatchToProps
    dispatchProps.resetPassword = jest.fn()

    const ownProps = {
      navigation: {
        navigate: jest.fn(() => Promise.resolve())
      }
    }

    const mergedProps = mergeProps(ownProps, dispatchProps, ownProps)
    return mergedProps.goToLogin()
    .then(() => {
      expect(ownProps.navigation.navigate).toHaveBeenCalledWith('Login')
    })
  })
})
