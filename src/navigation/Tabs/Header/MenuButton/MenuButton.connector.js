import { connect } from 'react-redux'
import getCurrentCommunity from 'store/selectors/getCurrentCommunity'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'

export function mapStateToProps (state) {
  const currentContext = getCurrentNetwork(state) || getCurrentCommunity(state)
  return {
    currentContext
  }
}

export default connect(mapStateToProps)
