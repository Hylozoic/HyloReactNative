import { connect } from 'react-redux'
import { login, loginWithFacebook, loginWithGoogle, clearCurrentUser } from './actions'
import getMe from '../../store/selectors/getMe'
import fetchCurrentUser from '../../store/actions/fetchCurrentUser'
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
    login: (email, password) =>
      dispatch(login(email, password))
      .then(({ error }) => {
        if (error) return
        return dispatch(clearCurrentUser()) && dispatch(fetchCurrentUser())
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
