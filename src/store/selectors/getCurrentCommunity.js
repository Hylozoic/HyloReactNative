import getCurrentCommunityId from './getCurrentCommunityId'
import getCommunity from './getCommunity'

export default function (state, props) {
  return getCommunity(state, {id: getCurrentCommunityId(state, props)})
}
