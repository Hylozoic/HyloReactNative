import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
  return bindActionCreators({
    checkSessionAndSetSignedIn,
    fetchCurrentUser
  }, dispatch)
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const loadCurrentUserSession = () =>
    dispatchProps
      .checkSessionAndSetSignedIn()
      .then(({ payload: signedIn }) => {
        if (signedIn) {
          return dispatchProps.fetchCurrentUser()
        }
      })

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    loadCurrentUserSession
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)