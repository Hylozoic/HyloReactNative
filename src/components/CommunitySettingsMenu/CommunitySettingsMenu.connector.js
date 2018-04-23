import { connect } from 'react-redux'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)

  return {
    communityName: community && community.name
  }
}

export default connect(mapStateToProps)
