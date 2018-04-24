import { get } from 'lodash/fp'
import getMe from './getMe'
import { createSelector } from 'reselect'

const getCurrentCommunityId = createSelector(
  getMe,
  state => get('communityId', state.currentNetworkAndCommunity),
  (currentUser, currentCommunityId) => currentCommunityId || ((currentUser) && get('id', currentUser.lastViewedCommunity()))
)

export default getCurrentCommunityId
