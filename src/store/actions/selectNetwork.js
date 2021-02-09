import { SELECT_GROUP } from 'store/constants'

export default function selectNetwork (id) {
  return {
    type: SELECT_GROUP,
    payload: id
  }
}
