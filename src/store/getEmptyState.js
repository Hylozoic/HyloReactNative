import orm from './models'
import { combinedReducers } from './reducers'

export default function getEmptyState () {
  return combinedReducers({ orm: orm.getEmptyState() }, { type: '' })
}
