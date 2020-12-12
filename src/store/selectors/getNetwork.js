import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'

/**
 * gets network from slug OR id
 */
const getNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => get('id', props),
  (state, props) => get('slug', props),
  ({ Network }, id, slug) => Network.safeGet({ id, slug })
)
export default getNetwork
