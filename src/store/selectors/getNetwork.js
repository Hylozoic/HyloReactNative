import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { isNull, isUndefined, omitBy, pick } from 'lodash/fp'

/**
 * gets network from slug OR id
 */
const getNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => omitBy(x => isNull(x) || isUndefined(x),
    pick(['id', 'slug'], props)),
  ({ Network }, match) => Network.safeGet(match)
)

export default getNetwork
