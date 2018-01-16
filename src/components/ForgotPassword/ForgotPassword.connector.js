import { connect } from 'react-redux'
import { resetPassword } from './ForgotPassword.store.js'

export const mapDispatchToProps = {
  resetPassword
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToLogin: () => navigation.navigate('Login')
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
