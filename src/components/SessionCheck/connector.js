import { connect } from 'react-redux'
import { checkSession } from './actions'
import getMe from '../../store/selectors/getMe'
import { get } from 'lodash/fp'

export function mapStateToProps (state) {
  const signupInProgress = get('settings.signupInProgress', getMe(state))
  return {
    loggedIn: state.session.loggedIn && !signupInProgress
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    checkSession: () => dispatch(checkSession())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
