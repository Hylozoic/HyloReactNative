import { get } from 'lodash/fp'
import { createSelector } from 'reselect'

const getCurrentCommunityId = createSelector(
  state => get('communityId', state.currentNetworkAndCommunity),
  currentCommunityId => currentCommunityId
)

export default getCurrentCommunityId
