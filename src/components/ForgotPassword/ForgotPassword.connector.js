import { connect } from 'react-redux'
import { resetPassword } from './ForgotPassword.store.js'

export const mapDispatchToProps = {
  resetPassword
}

export default connect(null, mapDispatchToProps)
