import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { pick, identity } from 'lodash'

/**
 * gets community from slug OR id
 */
const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.id,
  (state, props) => props.slug,
  (session, id, slug) => session.Community.safeGet(pick({id, slug}, identity))
)

export default getCommunity
