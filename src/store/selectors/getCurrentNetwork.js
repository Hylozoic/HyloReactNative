import orm from '../models'
import getCurrentNetworkId from './getCurrentNetworkId'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { ALL_COMMUNITIES_ID } from 'store/models/Network'
import { ALL_COMMUNITIES_NETWORK } from 'store/models/Network'

const getCurrentNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  getCurrentNetworkId,
  (session, id) => {
    // TODO: Initial load this into the ORM
    if (id === ALL_COMMUNITIES_ID) return ALL_COMMUNITIES_NETWORK
    return session.Network.safeGet({ id })
  }
)

export default getCurrentNetwork
