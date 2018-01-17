import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  const { communityName, communityUrl } = state.CreateCommunityFlow
  return {
    communityName,
    communityUrl
  }
}

export default connect(mapStateToProps)
