import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { isNull, isUndefined, omitBy, pick } from 'lodash/fp'

/**
 * gets community from slug OR id
 */
const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => omitBy(x => isNull(x) || isUndefined(x),
    pick(['id', 'slug'], props)),
  ({ Community }, match) => Community.safeGet(match)
)

export default getCommunity
