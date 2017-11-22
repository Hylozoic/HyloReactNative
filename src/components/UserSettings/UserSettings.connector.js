import { logout, loginWithFacebook } from '../Login/actions'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { unlinkAccount } from './UserSettings.store'
import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import { bindActionCreators } from 'redux'
import { resetToRoute } from 'util/navigation'

export function mapStateToProps (state, props) {
  const cancel = () => props.navigation.goBack()

  return {
    currentUser: getMe(state, props),
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
