import { connect } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'

export function mapStateToProps (state) {
  const currentContext = getCurrentNetwork(state) || getCurrentGroup(state)

  return {
    currentContext
  }
}

export default connect(mapStateToProps)
