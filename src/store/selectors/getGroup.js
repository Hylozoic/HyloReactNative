import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'

/**
 * gets group from slug OR id
 */
const getGroup = ormCreateSelector(
  orm,
  (state, props) => get('id', props),
  (state, props) => get('slug', props),
  ({ Group }, id, slug) => Group.safeGet({ id, slug })
)
export default getGroup
