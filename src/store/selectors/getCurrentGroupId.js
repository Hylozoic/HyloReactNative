import { createSelector } from 'reselect'

export const getCurrentGroupId = createSelector(
  state => state.session?.groupId,
  currentGroupId => currentGroupId
)

export default getCurrentGroupId
