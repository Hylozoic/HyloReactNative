import { mapDispatchToProps, mergeProps } from './ForgotPassword.connector'

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
    const testEmail = 'testemail'
    return mergedProps.goToLogin(testEmail)
      .then(() =>
        expect(ownProps.navigation.navigate)
          .toHaveBeenCalledWith('Login',
            { bannerMessage: `A link to reset your password has been sent to you at ${testEmail}` })
      )
  })
})
