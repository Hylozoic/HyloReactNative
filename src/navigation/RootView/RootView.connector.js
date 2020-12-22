import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, maxBy } from 'lodash/fp'
import { register as registerOneSignal } from 'util/onesignal'
import registerDevice from 'store/actions/registerDevice'
import checkSessionAndSetSignedIn from 'store/actions/checkSessionAndSetSignedIn'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getMe from 'store/selectors/getMe'
import { CHECK_SESSION_AND_SET_SIGNED_IN, FETCH_CURRENT_USER } from 'store/constants'
import selectCommunity from 'store/actions/selectCommunity'
import { getLastViewedCommunity } from 'store/models/Me'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const signedIn = state.session?.signedIn
  const signupInProgress = state.session?.signupInProgress
  const loading = state.pending[CHECK_SESSION_AND_SET_SIGNED_IN]
    || state.pending[FETCH_CURRENT_USER]

  return {
    loading,
    signedIn,
    signupInProgress,
    currentUser
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    ...bindActionCreators({
      checkSessionAndSetSignedIn,
      fetchCurrentUser,
      selectCommunity,
      registerDevice
    }, dispatch)
  }
}

export function buildLoadCurrentUserSession ({
  signedIn,
  fetchCurrentUser,
  selectCommunity,
  registerDevice
}) {
  return async () => {
    if (!signedIn) return
    const currentUserRaw = await fetchCurrentUser()
    const memberships = currentUserRaw?.payload?.data?.me?.memberships
    const lastViewedCommunityId = getLastViewedCommunity(memberships)?.id
    await selectCommunity(lastViewedCommunityId)
    await registerOneSignal({ registerDevice })
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    loadCurrentUserSession: buildLoadCurrentUserSession({
      signedIn: stateProps.signedIn,
      ...dispatchProps
    }),
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
