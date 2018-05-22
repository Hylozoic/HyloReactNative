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
 * gets community from slug OR id
 */
const getCommunity = createCachedSelector(
  getSession,
  (state, props) => get('id', props),
  (state, props) => get('slug', props),
  ({ Community }, id, slug) => Community.safeGet({id, slug})
)(
  (state, props) => `${props.id}:${props.slug}`
)
export default getCommunity
