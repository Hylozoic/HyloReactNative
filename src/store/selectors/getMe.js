/**
 * @providesModule store/selectors/getMe
 */

import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from '../../store/models'

const getMe = ormCreateSelector(
  orm,
  state => state.orm,
  session => session.Me.first()
)

export default getMe
