import { createSelector } from 'reselect'

export const getCurrentGroupId = createSelector(
  state => state.session?.groupId,
  (currentGroupId, lastViewedGroup) => {
    return currentGroupId
  }
)

export default getCurrentGroupId
