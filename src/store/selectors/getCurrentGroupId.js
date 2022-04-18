import { createSelector } from 'reselect'
import { PUBLIC_GROUP_ID } from 'store/models/Group'
import getLastViewedGroup from './getLastViewedGroup'

export const getCurrentGroupId = createSelector(
  state => state.session?.groupId,
  getLastViewedGroup,
  (currentGroupId, lastViewedGroup) => {
    return currentGroupId || lastViewedGroup?.id || PUBLIC_GROUP_ID
  }
)

export default getCurrentGroupId
