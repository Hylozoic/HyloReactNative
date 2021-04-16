import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import { ALL_GROUP_ID, PUBLIC_GROUP, PUBLIC_GROUP_ID } from 'store/models/Group'
import { ALL_GROUP } from 'store/models/Group'

const getGroup = ormCreateSelector(
  orm,
  (_, props) => get('id', props),
  (_, props) => get('slug', props),
  (session, id, slug) => {
    if (id === ALL_GROUP_ID || slug === ALL_GROUP_ID) {
      return ALL_GROUP
    }
    if (id === PUBLIC_GROUP_ID || slug === PUBLIC_GROUP_ID) {
      return PUBLIC_GROUP
    }

    return session?.Group.safeGet({ id, slug })
  }
)
export default getGroup
