import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import getMe from 'store/selectors/getMe'

const getMostRecentCommunityId = createSelector(
  getMe,
  currentUser => currentUser && get('id', currentUser.lastViewedCommunity())
)

export default getMostRecentCommunityId
