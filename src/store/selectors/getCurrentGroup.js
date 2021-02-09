import orm from '../models'
import getCurrentGroupId from './getCurrentGroupId'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCurrentGroup = ormCreateSelector(
  orm,
  getCurrentGroupId,
  (session, id) => session?.Group.safeGet({ id })
)
export default getCurrentGroup
