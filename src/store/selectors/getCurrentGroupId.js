import { createSelector } from 'reselect'
import { ALL_GROUP_ID } from 'store/models/Group'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'

export const getCurrentGroupId = createSelector(
  state => state.session?.groupId,
  getLastViewedGroup,
  (currentGroupId, lastViewedGroup) => currentGroupId || lastViewedGroup?.id || ALL_GROUP_ID
)

export default getCurrentGroupId
