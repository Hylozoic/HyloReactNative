import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm'

const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.id,
  (session, id) => session.Community.safeGet({id})
)

export default getCommunity
