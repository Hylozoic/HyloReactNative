import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import getMostRecentCommunityId from 'store/selectors/getMostRecentCommunityId'

const getCurrentCommunityId = createSelector(
  state => get('communityId', state.session),
  getMostRecentCommunityId,
  (currentCommunityId, mostRecentCommunityId) => currentCommunityId || mostRecentCommunityId
)

export default getCurrentCommunityId
