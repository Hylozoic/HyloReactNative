import { connect } from 'react-redux'
import sendPasswordReset from 'store/actions/sendPasswordReset'

export const mapDispatchToProps = {
  sendPasswordReset
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToLogin: (email) => navigation.navigate('Login', {
      bannerMessage: `A link to reset your password has been sent to you at ${email}`
    })
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
