import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import { resetToMainRoute } from 'routing/helpers'
import { logout, loginWithFacebook } from 'navigation/Login/actions'
import updateUserSettings from 'store/actions/updateUserSettings'
import { unlinkAccount } from './UserSettings.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const resettingPassword = get('route.params.section', props) === 'PasswordReset'
  const cancel = () => resettingPassword
    ? resetToMainRoute(props.navigation)
    : props.navigation.goBack()

  const goToNotificationSettings = () =>
    props.navigation.navigate('NotificationSettings')

  const goToBlockedUsers = () =>
    props.navigation.navigate('BlockedUsers')

  return {
    currentUser: getMe(state, props),
    resettingPassword,
    cancel,
    goToNotificationSettings,
    goToBlockedUsers
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    logout: () => dispatch(logout()),
    ...bindActionCreators({
      updateUserSettings,
      unlinkAccount,
      loginWithFacebook
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)