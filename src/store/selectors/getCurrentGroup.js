import orm from '../models'
import getCurrentGroupId from './getCurrentGroupId'
import { createSelector } from 'reselect'
import getGroup from './getGroup'

const getCurrentGroup = createSelector(
  state => state,
  getCurrentGroupId,
  (state, currentGroupId) => getGroup(state, { id: currentGroupId })
)

export default getCurrentGroup
