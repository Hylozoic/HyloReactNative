import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import checkSessionAndSetSignedIn from 'store/actions/checkSessionAndSetSignedIn'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getMe from 'store/selectors/getMe'
import { CHECK_SESSION_AND_SET_SIGNED_IN, FETCH_CURRENT_USER } from 'store/constants'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const signedIn = get('session.signedIn', state)
  const signupInProgress = get('session.signupInProgress', state)
  const loading = state.pending[CHECK_SESSION_AND_SET_SIGNED_IN]
    || state.pending[FETCH_CURRENT_USER]

  return {
    loading,
    signedIn,
    signupInProgress,
    currentUser
  }
}

export const mapDispatchToProps = {
  checkSessionAndSetSignedIn,
  fetchCurrentUser
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const loadCurrentUserSession = async () => {
    const { payload: signedIn } = await dispatchProps.checkSessionAndSetSignedIn()
    if (signedIn) await dispatchProps.fetchCurrentUser()
  }

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    loadCurrentUserSession
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
