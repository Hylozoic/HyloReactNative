import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pick } from 'lodash/fp'
import { checkSession } from './actions'

const mapStateToProps = pick('loggedIn')

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      checkSession
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
