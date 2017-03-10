import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout } from '../Login/actions'

function mapStateToProps (state) {
  return {} // TODO
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      logout
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
