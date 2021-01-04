import { createSelector } from 'reselect'

export default createSelector(
  state => state.session,
  session => session
)
