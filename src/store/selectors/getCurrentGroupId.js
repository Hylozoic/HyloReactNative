import { get, first, orderBy } from 'lodash/fp'
import { createSelector } from 'reselect'
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
  state => get('groupId', state.session),
  getLastViewedGroup,
  (currentGroupId, lastViewedGroup) => currentGroupId || lastViewedGroup?.id
)

export default getCurrentGroupId
