import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const MODULE_NAME = 'PostHeader'

// Constants
export const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { slug }) => slug,
  (session, slug) => session.Community.safeGet({slug})
)
