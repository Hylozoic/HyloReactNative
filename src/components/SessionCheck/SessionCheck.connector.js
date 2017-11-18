import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import fetchCurrentUser, { FETCH_CURRENT_USER } from '../../store/actions/fetchCurrentUser'
import {
  checkSession,
  CHECK_SESSION,
  setEntryUrl,
  getEntryUrl,
  resetEntryUrl
} from './SessionCheck.store'
import { getSignupStep1Complete } from '../SignupFlow/SignupFlow.store'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state) {
  const pending = !!(state.pending[CHECK_SESSION] || state.pending[FETCH_CURRENT_USER])
  const currentUser = getMe(state)
  const signupInProgress = get('settings.signupInProgress', currentUser)
  const loggedIn = state.session.loggedIn
  const loading = pending || loggedIn === undefined
  return {
    // NOTE: loading is necessary so that the LoginNavigator
    // doesn't render unncessarily on first render when already logged in
    // but the sessionCheck or fetchCurrentUser have been kicked-off.
    loading,
    pending,
    loggedIn,
    signupInProgress,
    signupStep1Complete: getSignupStep1Complete(state),
    currentUser,
    entryUrl: getEntryUrl(state)
  }
}

const mapDispatchToProps = {
  checkSession,
  setEntryUrl,
  resetEntryUrl,
  fetchCurrentUser
}

export default connect(mapStateToProps, mapDispatchToProps)
