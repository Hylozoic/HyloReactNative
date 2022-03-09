import { connect } from 'react-redux'
import { register as registerOneSignal } from 'util/onesignal'
import OneSignal from 'react-native-onesignal'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getMe from 'store/selectors/getMe'
import { FETCH_CURRENT_USER } from 'store/constants'
import selectGroup from 'store/actions/selectGroup'
import { getLastViewedGroup } from 'store/models/Me'
import getSignedIn from 'store/selectors/getSignedIn'
import getSignupInProgress from 'store/selectors/getSignupInProgress'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const signedIn = getSignedIn(state)
  const signupInProgress = getSignupInProgress(state)
  const returnToPath = getReturnToPath(state)
  const loading = state.pending[FETCH_CURRENT_USER]

  return {
    loading,
    signedIn,
    signupInProgress,
    returnToPath,
    currentUser
  }
}

export const mapDispatchToProps = {
  fetchCurrentUser,
  selectGroup,
  registerDevice,
  setReturnToPath
}

export function buildLoadCurrentUserSession ({
  fetchCurrentUser,
  selectGroup,
  registerDevice
}) {
  return async () => {
    const currentUserRaw = await fetchCurrentUser()
    if (currentUserRaw?.payload?.data?.me) {
      const memberships = currentUserRaw?.payload?.data?.me?.memberships
      const lastViewedgroupId = getLastViewedGroup(memberships)?.id
      await selectGroup(lastViewedgroupId)
      await registerOneSignal({ registerDevice })
      // Prompt for push on iOS
      OneSignal.promptForPushNotificationsWithUserResponse(() => {})
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    loadCurrentUserSession: buildLoadCurrentUserSession(dispatchProps),
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
