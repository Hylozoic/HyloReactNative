import { connect } from 'react-redux'
import { resetPassword } from './ForgotPassword.store.js'

export const mapDispatchToProps = {
  resetPassword
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = stateProps
  return {
    goToLogin: () => navigation.navigate('Login')
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
