import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { resetToRoute, resetToMainRoute } from 'util/navigation'
import { logout, loginWithFacebook } from '../Login/actions'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { unlinkAccount } from './UserSettings.store'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const resettingPassword = get('navigation.state.routeName', props) === 'PasswordReset'
  const cancel = () => resettingPassword
    ? resetToMainRoute(props.navigation)
    : props.navigation.goBack()

  return {
    currentUser: getMe(state, props),
    resettingPassword,
    cancel
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    logout: () => {
      resetToRoute(props.navigation, 'Login')
      return dispatch(logout())
    },
    ...bindActionCreators({
      updateUserSettings,
      unlinkAccount,
      loginWithFacebook
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
