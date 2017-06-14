import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { checkSession } from './actions'

function mapStateToProps (state) {
  return {
    loggedIn: state.session.loggedIn
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
