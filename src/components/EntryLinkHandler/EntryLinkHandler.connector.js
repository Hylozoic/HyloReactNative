import { connect } from 'react-redux'
import { setEntryURL } from '../SessionCheck/SessionCheck.store'

function mapStateToProps (state, props) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    setEntryUrl: function (path) {
      if (path.startsWith('/')) path = path.slice(1)
      return dispatch(setEntryURL(INTERNAL_ROUTE_URI_PREFIX + path))
    }
  }
}

export const INTERNAL_ROUTE_URI_PREFIX = 'internalRouting://'

export default connect(mapStateToProps, mapDispatchToProps)
