import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  return {
    goToNext: () => props.navigation.navigate({routeName: 'SignupFlow5', key: 'SignupFlow5'})
  }
}

export default connect(mapStateToProps)
