import { SELECT_GROUP } from 'store/constants'

export default function selectGroup (groupSlug) {
  return {
    type: SELECT_GROUP,
    payload: groupSlug
  }
}
