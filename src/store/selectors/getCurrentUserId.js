import { createSelector } from 'redux-orm'

import orm from '../models'

const getCurrentUserId = createSelector(
  orm,
  state => state.orm,
  session => session.Me.first().id
)

export default getCurrentUserId
