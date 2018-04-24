/**
 * @providesModule store/selectors/getCanModerate
 */
import getMe from './getMe'
import getCurrentCommunity from './getCurrentCommunity'

import { createSelector } from 'reselect'

const getCanModerate = createSelector(
  getMe,
  getCurrentCommunity,
  (currentUser, currentCommunity) => (currentUser && currentUser.canModerate(currentCommunity))
)

export default getCanModerate
