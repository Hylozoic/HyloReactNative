import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { checkSession } from './actions'
import getMe from '../../store/selectors/getMe'
import { get } from 'lodash/fp'

function mapStateToProps (state) {
  const signupInProgress = get('settings.signupInProgress', getMe(state))
  return {
    loggedIn: state.session.loggedIn && !signupInProgress
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      checkSession
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
