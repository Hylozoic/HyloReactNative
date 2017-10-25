import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from '../../store/models'

// TODO put this back to using selector once confirmed this isnt a memoization issue

// const getMe = ormCreateSelector(
//   orm,
//   state => state.orm,
//   session => session.Me.first()
// )

export const getMe = (state) => {
  const session = orm.session(state.orm)
  return session.Me.first()
}

export default getMe
