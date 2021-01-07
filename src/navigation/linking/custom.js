import { Linking } from 'react-native'
import { getStateFromPath as getStateFromPathDefault } from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'
import { parse } from 'url'
import store from 'store'
import getSignedIn from 'store/selectors/getSignedIn'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'
import { navigationRef } from 'navigation/RootNavigation'
import { getActionFromState } from '@react-navigation/native'

// NOTE: This custom routing config and utilities
// This way of mapping screens to paths is being used
// in alternate to the default linking config.screens
// route mapping as the current version of react-navigation
// doesn't allow for multiple paths to match to the same
// screen.

export const routesConfig = {
  '/c/:slug/join/:accessCode?':                              'JoinCommunity',
  // http://hylo.com/h/use-invitation?token=ebda24b2-d5d7-4d10-8558-b160e6f5d362&email=lorenjohnson+invitetest111@gmail.com&utm_swu=9555
  '/h/use-invitation/:token?':                               'JoinCommunity',
  '/signup':                                                 'Signup',
  // AuthNavigator route...             
  // 'passwordResetTokenLogin/:userId/:loginToken/:nextURL':   'Login',
  '/':                                                       'AppNavigator/Tabs/Home/Feed',
  '/m/:id':                                                  'AppNavigator/Tabs/Members/Member',
  '/:context(c|n|all)/:communityId':                         'AppNavigator/Tabs/Home/Feed',
  '/:context(c|n)/:contextId/:topicName':                    'AppNavigator/TopicFeed',
  '/m':                                                      'AppNavigator/Tabs/Members/Members',
  '/:context(c|n)/:contextId/m/:id':                         'AppNavigator/Member',
  '/:context(all)/p/:id':                                    'AppNavigator/PostDetails',
  '/:context(c|n)/:contextId/p/:id':                         'AppNavigator/PostDetails',
  '/p/:id':                                                  'AppNavigator/PostDetails',
  '/p/:id/edit':                                             'AppNavigator/PostEditor',
  '/:context(c|n)/:contextId/p/:id/edit':                    'AppNavigator/PostEditor',
  '/settings/:section?':                                     'AppNavigator/UserSettings',
  '/t/:id':                                                  'AppNavigator/Thread',
  '/t':                                                      'AppNavigator/ThreadList'
}

export const navigateToLinkingPath = linkingPath => {
  // setInitialState(linking.getStateFromPath(returnToPath))
  // reset(linking.getStateFromPath(returnToPath))
  const state = getStateFromPath(returnToPath)
  const action = getActionFromState(state)
  console.log('!!! action:', action)

  navigationRef.current.dispatch(state => {
    console.log('!!!! state:', state)
    return action
  })
}

// Matches path to routes and returns a react-navigation screen path
// (accordingly params appended as a querystring)
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

const getInitialURL = async () => {
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
}

const subscribe = listener => {
  const onReceiveURL = ({ url }) => {
    const signedIn = getSignedIn(store.getState())

    if (!signedIn) {
      const path = parse(url).path
      store.dispatch(setReturnToPath(path))
    } else {
      // const path = parse(url).path
      // const state = getStateFromPath(path)
      // // const action = getActionFromState(state)    
      // reset(state)
      return listener(url)
    }
  }

  Linking.addEventListener('url', onReceiveURL)

  return () => {
    Linking.removeEventListener('url', onReceiveURL)
  }
}

const getStateFromPath = path => {
  const matchedStatePath = matchRouteToScreenPath(path, routesConfig)
  const statePath = matchedStatePath ?? ''

  return getStateFromPathDefault(statePath)
}

// React Navigation linking config
//

export const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
  'hyloapp://'
]

export default {
  prefixes,
  getInitialURL,
  subscribe,
  getStateFromPath,
  getPathFromState: () => {}
}
