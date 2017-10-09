import { createSelector } from 'redux-orm'

import orm from '../models'

const getCurrentUserId = createSelector(
  orm,
  state => state.orm,
  session => {
    const me = session.Me.first()
    return me && me.id
  }
)

export default getCurrentUserId
