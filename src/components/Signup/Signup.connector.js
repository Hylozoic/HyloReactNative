import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  const goToSignupFlow = () => props.navigation.navigate('SignupFlow1')
  return {
    goToSignupFlow
  }
}

export default connect(mapStateToProps)
