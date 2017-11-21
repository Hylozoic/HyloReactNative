import { connect } from 'react-redux'
import { checkSession } from './SessionCheck.store'
import { resetToRoute } from 'util/navigation'

const mapDispatchToProps = {checkSession}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps

  const handleResult = ({ error, payload: loggedIn }) => {
    if (error) {
      setTimeout(checkSession, 1000)
    } else if (loggedIn) {
      return ownProps.fetchCurrentUserAndRedirect()
    } else {
      resetToRoute(navigation, 'Login')
    }
  }

  const checkSession = () => dispatchProps.checkSession().then(handleResult)

  return {...ownProps, checkSession}
}

export default connect(null, mapDispatchToProps, mergeProps)
