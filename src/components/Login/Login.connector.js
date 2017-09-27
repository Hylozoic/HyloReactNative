import { connect } from 'react-redux'
import { login, loginWithFacebook, loginWithGoogle } from './actions'
import getMe from '../../store/selectors/getMe'
import { get } from 'lodash/fp'

function mapStateToProps (state, props) {
  const goToSignup = () => props.navigation.navigate('Signup')
  const signupInProgress = get('settings.signupInProgress', getMe(state))

  return {
    error: state.session.loginError,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup,
    signupInProgress
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loginWithFacebook: (token) => dispatch(loginWithFacebook(token)),
    loginWithGoogle: (token) => dispatch(loginWithGoogle(token)),
    login: (email, password) => dispatch(login(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
