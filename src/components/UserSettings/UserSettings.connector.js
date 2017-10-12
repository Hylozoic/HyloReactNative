import { logout, loginWithFacebook } from '../Login/actions'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { unlinkAccount } from './UserSettings.store'
import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const cancel = () => props.navigation.goBack()

  return {
    currentUser: getMe(state, props),
    cancel
  }
}

export const mapDispatchToProps = {
  logout, updateUserSettings, unlinkAccount, loginWithFacebook
}

export default connect(mapStateToProps, mapDispatchToProps)
