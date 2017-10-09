import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { init as initOneSignal } from 'util/onesignal'
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
import { get } from 'lodash/fp'

export function mapStateToProps (state) {
  const pending = state.pending[CHECK_SESSION] || state.pending[FETCH_CURRENT_USER]
  const signupInProgress = get('settings.signupInProgress', getMe(state))
  return {
    pending,
    loggedIn: state.session.loggedIn && !signupInProgress,
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
