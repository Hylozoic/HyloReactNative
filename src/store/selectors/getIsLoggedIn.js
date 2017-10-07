import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

export default createSelector(
  get('session'),
  get('isLoggedIn')
)
