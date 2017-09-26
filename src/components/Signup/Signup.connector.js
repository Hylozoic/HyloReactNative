import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  const goToSignupFlow = () => props.navigation.navigate('SignupFlow1')
  const goToLogin = () => props.navigation.navigate('Login')
  return {
    goToSignupFlow,
    goToLogin
  }
}

export default connect(mapStateToProps)
