import { CHANGE_COMMUNITY } from 'store/constants'

export default function changeCommunity (id) {
  return {
    type: CHANGE_COMMUNITY,
    payload: id
  }
}
