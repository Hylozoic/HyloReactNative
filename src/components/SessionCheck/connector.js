import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { checkSession } from './actions'
import getMe from '../../store/selectors/getMe'
import { get } from 'lodash/fp'
import fetchVersion from 'util/fetchVersion'

export function mapStateToProps (state) {
  const signupInProgress = get('settings.signupInProgress', getMe(state))
  const result = fetchVersion()
  return {
    loggedIn: state.session.loggedIn && !signupInProgress,
    result
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      checkSession
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
