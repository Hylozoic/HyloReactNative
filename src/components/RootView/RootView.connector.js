import { connect } from 'react-redux'
import checkSessionAndSetSignedIn from 'store/actions/checkSessionAndSetSignedIn'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getMe from 'store/selectors/getMe'
import { CHECK_SESSION_AND_SET_SIGNED_IN, FETCH_CURRENT_USER } from '../../store/constants'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const signedIn = state.session.signedIn
  const loading = state.pending[CHECK_SESSION_AND_SET_SIGNED_IN]
    || state.pending[FETCH_CURRENT_USER]
  return {
    loading,
    signedIn,
    currentUser
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    checkSessionAndSetSignedIn: () => dispatch(checkSessionAndSetSignedIn()),
    fetchCurrentUser: () => dispatch(fetchCurrentUser())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const handleResult = ({ error, payload: signedIn }) => {
    if (error) {
      // automatically retry -- this prevents us from getting stuck with
      // nothing to interact with if we start the app while temporarily offline
      return new Promise(resolve =>
        setTimeout(() => resolve(checkSessionWithRetry()), 1000))
    } else if (signedIn) {
      return dispatchProps.fetchCurrentUser()
    }
  }

  const setupSessionWithRetry = () =>
    dispatchProps.checkSessionAndSetSignedIn().then(handleResult)

  return {
    ...ownProps,
    ...stateProps,
    setupSessionWithRetry
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
