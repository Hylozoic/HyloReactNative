import { logout } from '../Login/actions'
import updateUserSettings from '../../store/actions/updateUserSettings'
import { unlinkAccount } from './UserSettings.store'
import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state, props) {
  const cancel = () => props.navigation.goBack()

  return {
    currentUser: getMe(state, props),
    facebookUrl: 'facb',
    cancel
  }
}

export const mapDispatchToProps = {
  logout, updateUserSettings, unlinkAccount
}

export default connect(mapStateToProps, mapDispatchToProps)
