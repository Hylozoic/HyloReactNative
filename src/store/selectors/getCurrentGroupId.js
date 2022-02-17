import { first, orderBy } from 'lodash/fp'
import { createSelector } from 'reselect'
import { ALL_GROUP_ID } from 'store/models/Group'
import getMemberships from 'store/selectors/getMemberships'

const getLastViewedGroup = createSelector(
  getMemberships,
  memberships => {
    if (memberships.length < 1) return null

    return first(
      orderBy(m => new Date(m.lastViewedAt), 'desc', memberships)
    ).group
  }
)

const getCurrentGroupId = createSelector(
  state => state.session?.groupId,
  getLastViewedGroup,
  (currentGroupId, lastViewedGroup) => currentGroupId || lastViewedGroup?.id || ALL_GROUP_ID
)

export default getCurrentGroupId
