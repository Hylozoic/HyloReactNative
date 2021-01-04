import { createSelector } from 'reselect'
import getSession from './getSession'

export default createSelector(
  getSession,
  session => session.returnToPath
)
