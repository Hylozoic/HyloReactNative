import { SET_CURRENT_GROUP_ID } from 'store/constants'

export default function setCurrentGroupId (groupId) {
  return {
    type: SET_CURRENT_GROUP_ID,
    payload: groupId
  }
}
