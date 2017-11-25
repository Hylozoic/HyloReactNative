import { connect } from 'react-redux'
import { checkSession } from './SessionCheck.store'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'

const mapDispatchToProps = {checkSession, fetchCurrentUser}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const handleResult = ({ error, payload: loggedIn }) => {
    if (error) {
      // automatically retry -- this prevents us from getting stuck with
      // nothing to interact with if we start the app while temporarily offline
      return new Promise(resolve =>
        setTimeout(() => resolve(checkSession()), 1000))
    } else if (loggedIn) {
      return dispatchProps.fetchCurrentUser()
    }
  }

  const checkSession = () => dispatchProps.checkSession().then(handleResult)

  return {...ownProps, checkSession}
}

export default connect(null, mapDispatchToProps, mergeProps)
