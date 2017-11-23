import { connect } from 'react-redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { getDeepLink } from '../DeepLinkHandler/DeepLinkHandler.store'
import { redirectAfterLogin } from 'util/navigation'

function mapStateToProps (state, props) {
  return {
    deepLink: getDeepLink(state)
  }
}

const mapDispatchToProps = {fetchCurrentUser}

function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    fetchCurrentUserAndRedirect: () =>
      dispatchProps.fetchCurrentUser().then(({ error, payload }) =>
        !error && redirectAfterLogin({
          navigation: ownProps.navigation,
          currentUser: payload.data.me,
          deepLink: stateProps.deepLink
        })),

    // for use by DeepLinkHandler (has its own user data & different navigator)
    redirectNow: ({ currentUser, navigation, deepLink }) =>
      redirectAfterLogin({
        navigation: navigation || ownProps.navigation,
        currentUser,
        deepLink: deepLink || stateProps.deepLink
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
