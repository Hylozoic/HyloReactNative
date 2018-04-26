import orm from '../models'
import getCurrentCommunityId from './getCurrentCommunityId'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCurrentCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  getCurrentCommunityId,
  (session, id) => session.Community.safeGet({id})
)
export default getCurrentCommunity
