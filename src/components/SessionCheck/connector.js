import { connect } from 'react-redux'
import { checkSession, checkVersion, CHECK_VERSION } from './actions'
import getMe from '../../store/selectors/getMe'
import { get } from 'lodash/fp'
import { platformName, appVersion } from 'util/platform'

export function mapStateToProps (state) {
  const signupInProgress = get('settings.signupInProgress', getMe(state))
  const pending = state.pending[CHECK_VERSION]
  return {
    loggedIn: state.session.loggedIn && !signupInProgress,
    showUpdateModal: state.session.checkVersion,
    pending
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    checkSession: () => dispatch(checkSession()),
    checkVersion: () => dispatch(checkVersion(platformName, appVersion))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
