import { SELECT_COMMUNITY } from 'store/constants'

export default function selectCommunity (id) {
  return {
    type: SELECT_COMMUNITY,
    payload: id
  }
}
