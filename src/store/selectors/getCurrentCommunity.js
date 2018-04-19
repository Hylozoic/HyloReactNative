import getCurrentCommunityId from './getCurrentCommunityId'
import getCommunity from './getCommunity'
import { createSelector } from 'reselect'

const getCurrentCommunity = createSelector(
  state => state,
  getCurrentCommunityId,
  (state, id) => getCommunity(state, {id})
)
export default getCurrentCommunity
