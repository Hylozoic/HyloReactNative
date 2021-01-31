import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getPerson = ormCreateSelector(
  orm,
  (state, { personId }) => personId,
  ({ Person }, id) => Person.idExists(id) ? Person.withId(id) : null
)

export default getPerson
