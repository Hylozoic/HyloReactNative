import { connect } from 'react-redux'
import { loginByToken } from '../Login/actions'
import updateUserSettings from '../../store/actions/updateUserSettings.js'

export function mapStateToProps (state, props) {
  // getCurrentUser...
  // console.log(this.props.navigation.state.params)
  // userId, token, nextURL
  //
  // Get currentUser based on API call to loginByToken, or fail
  // (loginByToken)
  //
  // if success
  //    make sure session is set in app and
  //    continue to render component
  // if fail
  //    redirect back to login page with error message
  // reset password function forwards to HOME after done
  return props
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updatePassword: (password) => dispatch(updateUserSettings({password}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
