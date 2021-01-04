import { Linking } from 'react-native'
import { getStateFromPath as getStateFromPathDefault } from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'
import { parse } from 'url'
import store from 'store'
import getSignedIn from 'store/selectors/getSignedIn'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'

export const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
  'hyloapp://'
]
// Matched params are returned to the matched screen in `route.params`
export const routesConfig = {
  '/':                                                       'AppNavigator/Tabs/Home/Feed',
  '/m/:id':                                                  'AppNavigator/Tabs/Members/Member',
  '/:context(c|n|all)/:contextId?':                          'AppNavigator/Tabs/Home',
  '/:context(c|n)/:contextId/:topicName':                    'AppNavigator/TopicFeed',
  '/m':                                                      'AppNavigator/Tabs/Members',
  '/:context(c|n)/:contextId/m/:id':                         'AppNavigator/Member',
  '/:context(all)/p/:id':                                    'AppNavigator/PostDetails',
  '/:context(c|n)/:contextId/p/:id':                         'AppNavigator/PostDetails',
  '/p/:id':                                                  'AppNavigator/PostDetails',
  '/p/:id/edit':                                             'AppNavigator/PostEditor',
  '/:context(c|n)/:contextId/p/:id/edit':                    'AppNavigator/PostEditor',
  '/settings/:section?':                                     'AppNavigator/UserSettings',
  '/t/:id':                                                  'AppNavigator/Thread',
  /// TODO: I don't see a great reason that this is still a constant
  '/t':                                                      'AppNavigator/ThreadList',
  '/c/:slug/join/:accessCode?':                              'JoinCommunity',
  // http://hylo.com/h/use-invitation?token=ebda24b2-d5d7-4d10-8558-b160e6f5d362&email=lorenjohnson+invitetest111@gmail.com&utm_swu=9555
  '/h/use-invitation/:token?':                               'JoinCommunity',
  '/signup':                                                 'Signup'
  // AuthNavigator route...             
  // 'passwordResetTokenLogin/:userId/:loginToken/:nextURL':   'Login'
}

// Matches path to routes and returns a screen path
// with params appended as a querystring
export function matchRouteToScreenPath (incomingPathAndQuery, routes) {
  const [incomingPath, incomingQueryString] = incomingPathAndQuery.split('?')

  for (const pathMatcher in routes) {
    const matched = match(pathMatcher)(incomingPath)
    if (matched) {
      const screenPath = routes[pathMatcher]
      const screenQueryString = qs.stringify(matched.params, {
        encode: true,
        strict: true
      })
      const screenAndIncomingQueryString = [screenQueryString, incomingQueryString]
        .filter(Boolean)
        .join('&')

      return [screenPath, screenAndIncomingQueryString]
        .filter(Boolean)
        .join('?')
    }
  }
}

export const getStateFromReturnToPath = () => {
  const returnToPath = getReturnToPath(store.getState())

  if (!returnToPath) return null

  return routing.getStateFromPath(returnToPath)
}

export const routing = {
  prefixes,

  async getInitialURL() {
    const url = await Linking.getInitialURL()
    const signedIn = getSignedIn(store.getState())

    if (url != null) {
      if (!signedIn) {
        const path = parse(url).path
        store.dispatch(setReturnToPath(path))
      } else {
        return url
      }
    }
  },

  subscribe(listener) {
    const onReceiveURL = ({ url }) => {
      const signedIn = getSignedIn(store.getState())

      if (!signedIn) {
        const path = parse(url).path
        store.dispatch(setReturnToPath(path))
      } else {
        return listener(url)
      }
    }

    Linking.addEventListener('url', onReceiveURL)

    return () => {
      Linking.removeEventListener('url', onReceiveURL)
    }
  },

  getStateFromPath: path => {
    const matchedStatePath = matchRouteToScreenPath(path, routesConfig)
    const statePath = matchedStatePath || path
  
    return getStateFromPathDefault(statePath)
  },

  getPathFromState: () => {}
}

export default routing
