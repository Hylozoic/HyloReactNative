import orm from '../models'
import getCurrentNetworkId from './getCurrentNetworkId'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { ALL_COMMUNITIES_ID } from '../models/Community'

const getCurrentNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  getCurrentNetworkId,
  (session, id) => {
    console.log('id', id)
    if (id === ALL_COMMUNITIES_ID) return {id: ALL_COMMUNITIES_ID}
    return session.Network.safeGet({id})
  }
)

export default getCurrentNetwork
