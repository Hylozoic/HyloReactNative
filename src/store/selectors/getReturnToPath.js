import { createSelector } from 'reselect'

export default createSelector(
  state => state.returnToPath,
  returnToPath => returnToPath
)
