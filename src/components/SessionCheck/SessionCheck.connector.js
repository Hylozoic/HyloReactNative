import { connect } from 'react-redux'
import { checkSession } from './SessionCheck.store'
import { resetToRoute } from 'util/navigation'
import { getDeepLink } from '../DeepLinkHandler/DeepLinkHandler.store'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { redirectAfterLogin } from 'util/navigation'

function mapStateToProps (state, props) {
  return {
    deepLink: getDeepLink(state)
  }
}

const mapDispatchToProps = {checkSession, fetchCurrentUser}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const handleResult = ({ error, payload: loggedIn }) => {
    if (error) {
      // automatically retry -- this prevents us from getting stuck with
      // nothing to interact with if we open the app while temporarily offline
      setTimeout(checkSession, 1000)
    } else if (loggedIn) {
      return dispatchProps.fetchCurrentUser().then(({ error, payload }) =>
        !error && redirectAfterLogin({
          navigation: ownProps.navigation,
          currentUser: payload.data.me,
          deepLink: stateProps.deepLink
        }))
    } else {
      resetToRoute(ownProps.navigation, 'Login')
    }
  }

  const checkSession = () => dispatchProps.checkSession().then(handleResult)

  return {...ownProps, checkSession}
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
