import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
// import getMostRecentgroupId from 'store/selectors/getMostRecentgroupId'

const getCurrentGroupId = createSelector(
  state => get('groupId', state.session),
  // getMostRecentgroupId,
  currentGroupId => currentGroupId
)

export default getCurrentGroupId
