import getMe from '../selectors/getMe'
import Intercom from 'react-native-intercom'

export default function intercomMiddleware ({ getState }) {
  return next => action => {
    const wasMe = getMe(getState())
    const result = next(action)
    const isMe = getMe(getState())

    if (!wasMe && isMe) {
      const state = getState()
      const currentUser = getMe(state)
      console.log('!!!!! User Fetched  !!!!!')
      Intercom.registerIdentifiedUser({
        userId: currentUser.id
      })
      Intercom.setUserHash(currentUser.hash)
      Intercom.updateUser({
        email: currentUser.email,
        user_id: currentUser.id,
        name: currentUser.name
      })
    }
    return result
  }
}
