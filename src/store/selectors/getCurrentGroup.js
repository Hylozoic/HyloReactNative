import orm from '../models'
import getCurrentGroupId from './getCurrentGroupId'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCurrentGroup = ormCreateSelector(
  orm,
  getCurrentGroupId,
  (session, currentGroupid) =>
    session?.Group.safeGet({ id: currentGroupid })
)

export default getCurrentGroup
