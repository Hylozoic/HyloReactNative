import { Linking } from 'react-native'
import { getStateFromPath as getStateFromPathDefault } from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'
import store from 'store'
import setReturnToPath from 'store/actions/setReturnToPath'
import { getActionFromState } from '@react-navigation/native'
import { navigationRef } from 'navigation/RootView/RootView'

export const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
  'hyloapp://'
]

// NOTE: This custom routing config and utilities
// This way of mapping screens to paths is being used
// in alternate to the default linking config.screens
// route mapping as the current version of react-navigation
// doesn't allow for multiple paths to match to the same
// screen.
export const routesConfig = {
  '/noo/login/token':                                        'LoginByTokenHandler',
  // 'passwordResetTokenLogin/:userId/:loginToken/:nextURL': 'Login',
  '/groups/:slug/join/:accessCode':                          'JoinGroup',
  // http://hylo.com/h/use-invitation?token=ebda24b2-d5d7-4d10-8558-b160e6f5d362&email=lorenjohnson+invitetest111@gmail.com&utm_swu=9555
  '/h/use-invitation':                                       'JoinGroup',
  '/signup':                                                 'Signup',
  '/':                                                       'Drawer/Tabs/Home Tab/Feed',
  '/members/:id':                                            'Member - Modal',
  '/:context(groups)/:groupSlugFromLink':                    'Drawer/Tabs/Home Tab/Feed',
  '/:context(groups)/:groupSlugFromLink/topics/:topicName':  'Drawer/Tabs/Home Tab/Topic Feed',
  '/members':                                                'Drawer/Tabs/Home Tab/Members',
  '/:context(groups)/:groupSlugFromLink/members/:id':        'Drawer/Tabs/Home Tab/Member',
  '/:context(groups)/post/:id':                              'Drawer/Tabs/Home Tab/Post Details',
  '/:context(groups)/:groupSlugFromLink/post/:id':           'Drawer/Tabs/Home Tab/Post Details',
  '/post/:id':                                               'Post Details - Modal',
  '/post/:id/edit':                                          'Edit Post',
  '/:context(groups)/:groupSlugFromLink/post/:id/edit':      'Edit Post',
  '/settings/:section?':                                     'Drawer/Tabs/Profile Tab/My Profile',
  '/messages/:id':                                           'Drawer/Tabs/Messages Tab/Thread',
  '/messages':                                               'Drawer/Tabs/Messages Tab/Messages'
}

export const navigateToLinkingPath = (linkingPath, authed) => {
  const state = getStateFromPath(linkingPath)

  if (!state) {
    store.dispatch(setReturnToPath(null))
    return
  }

  const action = getActionFromState(state)

  // NOTE: This will thrown an error in dev when navigating to a state object 
  // with authed screens when not fully authed, it can be ignored.
  // The path will still be used once auth'd, and non-auth screens will get navigated
  // to.
  navigationRef.current?.dispatch(action)
  store.dispatch(setReturnToPath(null))
}

// Matches path to routes and returns a react-navigation screen path
// (accordingly params appended as a querystring)
export function matchRouteToScreenPath (incomingPathAndQuery, routes) {
  const [incomingPath, incomingQueryString] = incomingPathAndQuery.split('?')

  for (const pathMatcher in routes) {
    const pathMatch = match(pathMatcher)(incomingPath)

    if (pathMatch) {
      const routeMatch = routes[pathMatcher]
      const screenQueryString = qs.stringify(pathMatch.params, {
        encode: true,
        strict: true
      })
      const screenAndIncomingQueryString = [screenQueryString, incomingQueryString]
        .filter(Boolean)
        .join('&')

      return [routeMatch, screenAndIncomingQueryString]
        .filter(Boolean)
        .join('?')
    }
  }
}

const getInitialURL = async () => {
  const initialURL = await Linking.getInitialURL()

  if (initialURL) store.dispatch(setReturnToPath(initialURL))

  // Purposesly doesn't return to have
  // the effect of disabling default initialURL handling
}

const subscribe = listener => {
  const onReceiveURL = ({ url }) => {
    store.dispatch(setReturnToPath(url))
    return listener(url)
  }

  const eventSubscription = Linking.addEventListener('url', onReceiveURL)

  return () => eventSubscription.remove()
}

const getStateFromPath = path => {
  // TODO: Path should start with '/`,
  // catch exception or correct if not
  const matchedStatePath = matchRouteToScreenPath(path, routesConfig)
  const statePath = matchedStatePath ?? ''

  return getStateFromPathDefault(statePath)
}

// React Navigation linking config
//

export default {
  prefixes,
  getInitialURL,
  subscribe,
  getStateFromPath,
  getPathFromState: () => {}
}
