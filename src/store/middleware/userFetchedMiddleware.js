import getMe from '../selectors/getMe'
import getMixpanel from '../selectors/getMixpanel'
import Intercom from 'react-native-intercom'
import { isDev } from 'util/testing'

export default function userFetchedMiddleware ({ getState }) {
  return next => action => {
    const wasMe = getMe(getState())
    const result = next(action)
    const isMe = getMe(getState())
    const userFetched = !wasMe && isMe
    if (userFetched) {
      const state = getState()
      // Do these things with the currentUser the first time it's fetched in a session
      identifyMixpanelUser(state)
      registerIntercomUser(state)
    }
    return result
  }
}

export function identifyMixpanelUser (state) {
  const user = getMe(state)
  const mixpanel = getMixpanel(state)
  mixpanel.identify(user.id)
  mixpanel.set({
    '$name': user.name,
    '$email': user.email,
    '$location': user.location
  })
}

export function registerIntercomUser (state) {
  const user = getMe(state)
  Intercom.registerIdentifiedUser({
    userId: user.id
  })
  Intercom.setUserHash(user.hash)
  Intercom.updateUser({
    name: user.name,
    email: user.email
  })
}
