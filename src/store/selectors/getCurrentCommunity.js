import getCurrentCommunityId from './getCurrentCommunityId'
import getCommunity from './getCommunity'

export default function (state, props) {
  const currentCommunityId = getCurrentCommunityId(state, props)
  return getCommunity(state, {id: currentCommunityId})
}
