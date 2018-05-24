import { connect } from 'react-redux'
import { filter, get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  // TODO use a selector for this?
  const communities = props.selectedNetworkId
    ? filter(community => get('network.id', community) === props.selectedNetworkId, props.communities)
    : props.communities

  return {
    communities
  }
}

export default connect(mapStateToProps)
