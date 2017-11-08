import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  return {
    goToNext: () => props.navigation.navigate('SignupFlow5')
  }
}

export default connect(mapStateToProps)
