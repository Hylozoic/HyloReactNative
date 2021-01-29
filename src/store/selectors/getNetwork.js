import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import { ALL_COMMUNITIES_ID } from 'store/models/Network'
import { ALL_COMMUNITIES_NETWORK } from 'store/models/Network'

// gets network from slug OR id
const getNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  (_, props) => get('id', props),
  (_, props) => get('slug', props),
  ({ Network }, id, slug) => {
    if (id === ALL_COMMUNITIES_ID || slug === ALL_COMMUNITIES_ID) {
      return ALL_COMMUNITIES_NETWORK
    }
    return Network.safeGet({ id, slug })
  }
)
export default getNetwork
