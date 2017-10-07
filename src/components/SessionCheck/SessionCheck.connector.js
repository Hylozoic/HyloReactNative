import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { checkSession, setEntryURL, getEntryURL, resetEntryURL } from './SessionCheck.store'
import getMe from '../../store/selectors/getMe'
import { get } from 'lodash/fp'

export function mapStateToProps (state) {
  const signupInProgress = get('settings.signupInProgress', getMe(state))

  return {
    loggedIn: state.session.loggedIn && !signupInProgress,
    entryURL: getEntryURL(state)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      checkSession,
      setEntryURL,
      resetEntryURL
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
