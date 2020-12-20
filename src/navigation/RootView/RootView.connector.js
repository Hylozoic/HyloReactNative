import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, maxBy } from 'lodash/fp'
import checkSessionAndSetSignedIn from 'store/actions/checkSessionAndSetSignedIn'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getMe from 'store/selectors/getMe'
import { CHECK_SESSION_AND_SET_SIGNED_IN, FETCH_CURRENT_USER } from 'store/constants'
import selectCommunity from 'store/actions/selectCommunity'
import { getLastViewedCommunity } from 'store/models/Me'

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

export function loadCurrentUserSession ({
  checkSessionAndSetSignedIn,
  fetchCurrentUser,
  selectCommunity
}) {
  return async () => {
    const { payload: signedIn } = await checkSessionAndSetSignedIn()
    if (signedIn)  {
      const currentUserRaw = await fetchCurrentUser()
      const memberships = get('payload.data.me.memberships', currentUserRaw)
      const lastViewedCommunity = getLastViewedCommunity(memberships)
      await selectCommunity(get('id', lastViewedCommunity))
    }
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    loadCurrentUserSession: loadCurrentUserSession(
      bindActionCreators({
          checkSessionAndSetSignedIn,
          fetchCurrentUser,
          selectCommunity    
      }, dispatch)
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)
