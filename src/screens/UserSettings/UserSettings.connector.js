import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { resetToMainRoute } from 'navigation/linking/helpers'
import { loginWithFacebook } from 'screens/Login/actions'
import logout from 'store/actions/logout'
import updateUserSettings from 'store/actions/updateUserSettings'
import { unlinkAccount } from './UserSettings.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const resettingPassword = get('route.params.section', props) === 'PasswordReset'
  const cancel = () => resettingPassword
    ? resetToMainRoute(props.navigation)
    : props.navigation.goBack()

  const goToNotificationSettings = () =>
    props.navigation.navigate('Notification Settings')

  const goToBlockedUsers = () =>
    props.navigation.navigate('Blocked Users')

  return {
    currentUser: getMe(state, props),
    resettingPassword,
    cancel,
    goToNotificationSettings,
    goToBlockedUsers
  }
}

export const mapDispatchToProps = {
  logout,
  updateUserSettings,
  unlinkAccount,
  loginWithFacebook
}

export default connect(mapStateToProps, mapDispatchToProps)
