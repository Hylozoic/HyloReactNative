import { connect } from 'react-redux'
import { setEntryUrl } from '../SessionCheck/SessionCheck.store'

function mapStateToProps (state, props) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    setEntryUrl: function (path) {
      if (path.startsWith('/')) path = path.slice(1)
      return dispatch(setEntryUrl(INTERNAL_ROUTE_URI_PREFIX + path))
    }
  }
}

export const INTERNAL_ROUTE_URI_PREFIX = 'internalRouting://'

export default connect(mapStateToProps, mapDispatchToProps)
