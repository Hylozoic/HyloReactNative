import getMe from '../selectors/getMe'
import getMixpanel from '../selectors/getMixpanel'
import Intercom from '@intercom/intercom-react-native'
import { isProduction } from 'config'

export default function userFetchedMiddleware ({ getState }) {
  return next => async action => {
    const wasMe = getMe(getState())
    const result = next(action)
    const isMe = getMe(getState())
    const userFetched = !wasMe && isMe
    if (userFetched) {
      const state = getState()
      // Do these things with the currentUser the first time it's fetched in a session
      isProduction && await identifyMixpanelUser(state)
      isProduction && registerIntercomUser(state)
    }
    return result
  }
}

async function identifyMixpanelUser (state) {
  const user = getMe(state)
  const mixpanel = getMixpanel(state)
  await mixpanel.initialize()
  mixpanel.identify(user.id)
  mixpanel.set({
    $name: user.name,
    $email: user.email,
    $location: user.location
  })
}

function registerIntercomUser (state) {
  const user = getMe(state)
  Intercom.setUserHash(user.hash)
  Intercom.registerIdentifiedUser({
    userId: user.id
  })
  Intercom.updateUser({
    name: user.name,
    email: user.email
  })
}
