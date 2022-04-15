import { createSelector } from 'reselect'
import { PUBLIC_GROUP_ID } from 'store/models/Group'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'

export const getCurrentGroupId = createSelector(
  state => state.session?.groupId,
  getLastViewedGroup,
  (currentGroupId, lastViewedGroup) => currentGroupId || lastViewedGroup?.id || PUBLIC_GROUP_ID
)

export default getCurrentGroupId
