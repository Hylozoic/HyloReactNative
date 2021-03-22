import getMe from './getMe'
import getCurrentGroup from './getCurrentGroup'

import { createSelector } from 'reselect'

const getCanModerate = createSelector(
  getMe,
  getCurrentGroup,
  (currentUser, currentGroup) => (currentUser && currentUser.canModerate(currentGroup))
)

export default getCanModerate
