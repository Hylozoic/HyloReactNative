import { connect } from 'react-redux'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
  return {
    community
  }
}

export default connect(mapStateToProps)
