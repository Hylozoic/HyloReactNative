import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import createCachedSelector from 're-reselect'

const getSession = ormCreateSelector(
  orm,
  state => state.orm,
  session => session
)

/**
 * gets network from slug OR id
 */
const getNetwork = createCachedSelector(
  getSession,
  (state, props) => get('id', props),
  (state, props) => get('slug', props),
  ({ Network }, id, slug) => Network.safeGet({id, slug})
)(
  (state, props) => props ? `${props.id}:${props.slug}` : 0
)
export default getNetwork
