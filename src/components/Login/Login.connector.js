import { connect } from 'react-redux'
import { login, loginWithFacebook, loginWithGoogle } from './actions'
import fetchCurrentUser from '../../store/actions/fetchCurrentUser'

export function mapStateToProps (state, props) {
  const goToSignup = () => props.navigation.navigate('Signup')

  return {
    error: state.session.loginError,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    loginWithFacebook: (token) => dispatch(loginWithFacebook(token)),
    loginWithGoogle: (token) => dispatch(loginWithGoogle(token)),
    login: (email, password) =>
      dispatch(login(email, password))
      .then(({ error }) => !error && dispatch(fetchCurrentUser()))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
