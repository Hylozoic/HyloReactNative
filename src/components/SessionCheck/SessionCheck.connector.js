import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { init as initOneSignal } from 'util/onesignal'
import { get } from 'lodash/fp'
import fetchCurrentUser, { FETCH_CURRENT_USER } from '../../store/actions/fetchCurrentUser'
import registerDevice from '../../store/actions/registerDevice'
import {
  checkSession,
  CHECK_SESSION,
  setEntryURL,
  getEntryURL,
  resetEntryURL
} from './SessionCheck.store'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state) {
  const pending = !!(state.pending[CHECK_SESSION] || state.pending[FETCH_CURRENT_USER])
  const signupInProgress = get('settings.signupInProgress', getMe(state))
  const loggedIn = state.session.loggedIn && !signupInProgress
  return {
    // NOTE: loading is necessary so that the LoginNavigator
    // doesn't render unncessarily on first render when already logged in
    // but the sessionCheck or fetchCurrentUser have been kicked-off.
    loading: pending || loggedIn === undefined,
    pending,
    loggedIn,
    currentUser: getMe(state),
    entryURL: getEntryURL(state)
  }
}

export function mapDispatchToProps (dispatch) {
  const actions = {
    checkSession,
    setEntryURL,
    resetEntryURL,
    fetchCurrentUser
  }
  return {
    ...bindActionCreators(actions, dispatch),
    initOneSignal: () => {
      return initOneSignal({registerDevice: () => dispatch(registerDevice())})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
