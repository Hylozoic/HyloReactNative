import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'

/**
 * gets community from slug OR id
 */
const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => get('id', props),
  (state, props) => get('slug', props),
  ({ Community }, id, slug) => Community.safeGet({ id, slug })
)
export default getCommunity
