import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getMe = ormCreateSelector(
  orm,
  session => {
    return session.Me.first()
  }
)
export default getMe
