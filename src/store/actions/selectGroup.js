import { SELECT_GROUP } from 'store/constants'

export default function selectGroup (id) {
  return {
    type: SELECT_GROUP,
    payload: id
  }
}
