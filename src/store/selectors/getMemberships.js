import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getMemberships = ormCreateSelector(
  orm,
  session => {
    const me = session?.Me.first()
    if (!me) return []
    return session.Membership.filter({ person: me.id }).toModelArray()
  }
)

export default getMemberships
