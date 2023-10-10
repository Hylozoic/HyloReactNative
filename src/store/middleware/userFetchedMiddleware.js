import getMe from '../selectors/getMe'
import getMixpanel from '../selectors/getMixpanel'
import Intercom from '@intercom/intercom-react-native'
// import { isProduction } from 'config' // I think we should still make these calls in dev, but using the test mixpanel project

export default function userFetchedMiddleware ({ getState }) {
  return next => async action => {
    const wasMe = getMe(getState())
    const result = next(action)
    const isMe = getMe(getState())
    const userFetched = !wasMe && isMe
    if (userFetched) {
      const state = getState()

      // Do these things with the currentUser the first time it's fetched in a session
      await identifyMixpanelUser(state)
      registerIntercomUser(state)
    }
    return result
  }
}

async function identifyMixpanelUser (state) {
  const user = getMe(state)
  const mixpanel = getMixpanel(state)
  await mixpanel.init()
  mixpanel.identify(user.id)
  mixpanel.people.set({
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
