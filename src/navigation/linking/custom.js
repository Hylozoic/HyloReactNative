import { Linking } from 'react-native'
import { isString, reject } from 'lodash/fp'
import { getStateFromPath as getStateFromPathDefault } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'
import store from 'store'
import setReturnToPath from 'store/actions/setReturnToPath'
import { getActionFromState } from '@react-navigation/native'
import { INITIAL_NAV_STATE, navigationRef } from 'navigation/RootView/RootView'

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
// doesn't have a way to map multiple paths to the same
// screen.
export const routesConfig = {
  '/noo/login/token':                                        { screenPath: 'LoginByTokenHandler', noAuth: true },
  '/signup':                                                 { screenPath: 'Signup', noAuth: true },
  '/groups/:slug/join/:accessCode':                          'JoinGroup',
  '/h/use-invitation':                                       'JoinGroup',
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
  '/settings/account':                                       'Drawer/Tabs/Settings Tab/Account',
  '/settings/:section?':                                     'Drawer/Tabs/Settings Tab/Edit Profile',
  '/messages/:id':                                           'Drawer/Tabs/Messages Tab/Thread',
  '/messages':                                               'Drawer/Tabs/Messages Tab/Messages'
}

export const navigateToLinkingPath = async (linkingPath, authed) => {
  const state = getStateFromPath(linkingPath)

  if (!state) {
    store.dispatch(setReturnToPath(null))
    return
  }

  const action = getActionFromState(state)
  const noAuth = action.payload?.params?.noAuth

  if (noAuth || authed) {
    if (authed) {
      await navigationRef.current?.dispatch(CommonActions.reset(INITIAL_NAV_STATE))
    }
    await navigationRef.current?.dispatch(action)
    store.dispatch(setReturnToPath(null))
  }
}

// Matches path to routes and returns a react-navigation screen path
// (accordingly params appended as a querystring)
export function matchRouteToScreenPath (incomingPathAndQuery, routes) {
  const [incomingPath, incomingQueryString] = incomingPathAndQuery.split('?')

  for (const pathMatcher in routes) {
    const pathMatch = match(pathMatcher)(incomingPath)

    if (pathMatch) {
      const routeMatchWithOptions = routes[pathMatcher]
      let routeMatch = routeMatchWithOptions
      let options = {}

      // Collecting custom route options if present
      if (!isString(routeMatchWithOptions)) {
        routeMatch = routeMatchWithOptions?.screenPath
        options = reject('screenPath', routeMatchWithOptions)
      }

      const optionsQueryString = qs.stringify(options, {
        encode: true,
        strict: true
      })
      const screenQueryString = qs.stringify(pathMatch.params, {
        encode: true,
        strict: true
      })
      const screenAndIncomingQueryString = [optionsQueryString, screenQueryString, incomingQueryString]
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

  // NOTE: This function intentionally doesn't return to have which
  // has the effect of disabling the default initialURL handling
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
  const statePath = matchRouteToScreenPath(path, routesConfig)

  return getStateFromPathDefault(statePath ?? '')
}

// React Navigation linking config

export default {
  prefixes,
  getInitialURL,
  subscribe,
  getStateFromPath,
  getPathFromState: () => {}
}
