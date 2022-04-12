import { Linking } from 'react-native'
import { isEmpty } from 'lodash/fp'
import {
  getActionFromState,
  CommonActions,
  subscribe,
  getStateFromPath as getStateFromPathDefault
} from '@react-navigation/native'
import { match } from 'path-to-regexp'
import { URL } from 'react-native-url-polyfill'
import * as queryString from 'query-string'
import { PathHelpers } from 'hylo-shared'
import store from 'store'
import { getAuthorized } from 'store/selectors/getAuthState'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import { navigationRef } from 'navigation/linking/helpers'
import { modalScreenName } from './helpers'

export const DEFAULT_APP_HOST = 'https://hylo.com'

export const prefixes = [
  DEFAULT_APP_HOST,
  'http://hylo.com',
  'http://www.hylo.com',
  'https://www.hylo.com',
  'http://staging.hylo.com',
  'https://staging.hylo.com',
  'hyloapp://'
]

// Custom routing config and utilities:
//
// This way of mapping screens to paths is being used
// in alternate to the default linking config.screens
// route mapping as the current version of react-navigation
// doesn't have a way to map multiple paths to the same
// screen.
//
// There are two possible formats for specifying the target screen:
//  1) { screenPath: 'path/to/screen', ...providedStaticDefaultRouteParams }
//  2) 'path/to/screen' (assumed auth required)
//

/* eslint-disable key-spacing */
export const routesConfig = {
  '/login':                                                  'NonAuthRoot/Login',
  '/signup/:step(verify-email)':                             'NonAuthRoot/Signup/SignupEmailValidation',
  '/signup/:step?':                                          'NonAuthRoot/Signup/Signup Intro',
  '/noo/login/(jwt|token)':                                  'LoginByTokenHandler',
  '/h/use-invitation':                                       'JoinGroup',
  '/:context(groups)/:groupSlug/join/:accessCode':           'JoinGroup',

  // /members
  '/members/:id':                                            `AuthRoot/${modalScreenName('Member')}`,
  '/members':                                                'AuthRoot/Drawer/Tabs/Home Tab/Members',

  // special group routes (/all, /public)
  '/:groupSlug(all|public)':                                 'AuthRoot/Drawer/Tabs/Home Tab/Feed',
  '/:groupSlug(all|public)/post/:id':                        'AuthRoot/Drawer/Tabs/Home Tab/Post Details',
  '/:groupSlug(all)/members/:id':                            'AuthRoot/Drawer/Tabs/Home Tab/Member',
  '/:groupSlug(all)/topics/:topicName':                      'AuthRoot/Drawer/Tabs/Home Tab/Topic Feed',

  // map routes
  '/:groupSlug(all|public)/map':                             'AuthRoot/Drawer/Tabs/Home Tab/Map',
  '/:context(groups)/:groupSlug/map':                        'AuthRoot/Drawer/Tabs/Home Tab/Map',
  '/:groupSlug(all|public)/map/post/:id':                    `AuthRoot/${modalScreenName('Post Details')}`,
  '/:context(groups)/:groupSlug/map/post/:id':               `AuthRoot/${modalScreenName('Post Details')}`,
  '/:context(groups)/:groupSlug/detail':                     `AuthRoot/${modalScreenName('Group Detail')}`,

  // /groups
  '/:context(groups)/:groupSlug/settings/invite':            'AuthRoot/Group Settings/Invite',
  '/:context(groups)/:groupSlug/settings/requests':          'AuthRoot/Group Settings/Join Requests',
  '/:context(groups)/:groupSlug/settings/relationships':     'AuthRoot/Group Settings/Related Groups',
  '/:context(groups)/:groupSlug/settings/export':            'AuthRoot/Group Settings/Export Data',
  '/:context(groups)/:groupSlug/settings/delete':            'AuthRoot/Group Settings/Delete',
  '/:context(groups)/:groupSlug/settings':                   'AuthRoot/Group Settings/Settings',
  '/:context(groups)/:groupSlug/groups':                     'AuthRoot/Drawer/Tabs/Home Tab/Group Relationships',
  '/:context(groups)/:groupSlug/topics/:topicName':          'AuthRoot/Drawer/Tabs/Home Tab/Topic Feed',
  '/:context(groups)/:groupSlug/members/:id':                'AuthRoot/Drawer/Tabs/Home Tab/Member',
  '/:context(groups)/:groupSlug':                            'AuthRoot/Drawer/Tabs/Home Tab/Feed',
  '/:context(groups)/:groupSlug/post/:id':                   'AuthRoot/Drawer/Tabs/Home Tab/Post Details',
  '/:context(groups)/post/:id':                              'AuthRoot/Drawer/Tabs/Home Tab/Post Details',
  '/:context(groups)/:groupSlug/post/:id/edit':              'AuthRoot/Edit Post',

  // /post
  '/post/:id':                                               `AuthRoot/${modalScreenName('Post Details')}`,
  '/post/:id/edit':                                          'AuthRoot/Edit Post',

  // /settings
  '/settings/account':                                       'AuthRoot/Drawer/Tabs/Settings Tab/Account',
  '/settings/:section?':                                     'AuthRoot/Drawer/Tabs/Settings Tab/Edit Profile',

  // /messages
  '/messages/:id':                                           'AuthRoot/Drawer/Tabs/Messages Tab/Thread',
  '/messages':                                               'AuthRoot/Drawer/Tabs/Messages Tab/Messages',

  '/all':                                                    'AuthRoot/Drawer/Tabs/Home Tab/Feed',
  '/':                                                       'AuthRoot/Drawer/Tabs/Home Tab/Feed'
  // '/:unknownPath*':                                          'AuthRoot/Drawer/Tabs/Home Tab'
}

export const AUTH_ROOT_SCREEN_NAME = 'AuthRoot'
export const INITIAL_AUTH_NAV_STATE = {
  routes: [
    {
      name: AUTH_ROOT_SCREEN_NAME,
      state: {
        routes: [
          {
            name: 'Drawer',
            state: {
              routes: [
                {
                  name: 'Tabs',
                  state: {
                    routes: [
                      {
                        name: 'Home Tab',
                        state: {
                          initialRouteName: 'Feed',
                          routes: [
                            {
                              name: 'Group Navigation'
                            },
                            {
                              name: 'Feed'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

export const NON_AUTH_ROOT_SCREEN_NAME = 'NonAuthRoot'
export const INITIAL_NON_AUTH_NAV_STATE = {
  routes: [
    {
      name: NON_AUTH_ROOT_SCREEN_NAME,
      state: {
        routes: [
          {
            name: 'Signup'
          },
          {
            name: 'Login'
          }
        ]
      }
    }
  ]
}

// Could potentially be entirely replaced by `navigateToLinkingPath` below
// by adding these legacy routes in the routing above. The key differentiating
// feature besides the rourtes is the ability to provide a `groupSlug`.
export async function openURL (providedUrlOrPath, options = {}) {
  const urlOrPath = providedUrlOrPath.trim().toLowerCase()
  const linkingURL = new URL(urlOrPath, DEFAULT_APP_HOST)

  if (prefixes.includes(linkingURL.origin)) {
    const { length, [length - 2]: prefix, [length - 1]: suffix } = linkingURL.pathname.split('/')

    switch (prefix) {
      case 'members':
      case 'm':
      case 'u': {
        return navigateToLinkingPath(PathHelpers.mentionPath(suffix, options?.groupSlug))
      }
      case 'topics':
      case 'tag': {
        return navigateToLinkingPath(PathHelpers.topicPath(suffix, options?.groupSlug))
      }
    }

    return navigateToLinkingPath(linkingURL.pathname)
  }

  if (await Linking.canOpenURL(urlOrPath)) {
    return Linking.openURL(urlOrPath)
  }
}

export const resetToInitialNavState = providedIsAuthorized => {
  const isAuthorized = providedIsAuthorized || getAuthorized(store.getState())

  navigationRef.current?.dispatch(
    CommonActions.reset(
      isAuthorized
        ? INITIAL_AUTH_NAV_STATE
        : INITIAL_NON_AUTH_NAV_STATE
    )
  )
}

// This could possibly be replaced by updating the logic applied by Linking.openURL
// to not always force nav state reset to default (or storing returnTo URL?) for
// this case...
export const navigateToLinkingPath = async (providedUrl, reset = false) => {
  const linkingURL = new URL(providedUrl, DEFAULT_APP_HOST)
  const linkingPath = `${linkingURL.pathname}${linkingURL.search}`
  const state = getStateFromPath(linkingPath)
  const action = getActionFromState(state)

  if (reset) resetToInitialNavState()

  navigationRef.current?.dispatch(action)
}

export function getScreenPathWithParamsFromPath (incomingPathAndQuerystring, routes = routesConfig) {
  const {
    pathname: incomingPathname,
    search: incomingQuerystring
  } = new URL(incomingPathAndQuerystring, DEFAULT_APP_HOST)

  for (const pathMatcher in routes) {
    const pathMatch = match(pathMatcher)(incomingPathname)

    if (pathMatch) {
      const screenPath = routes[pathMatcher]
      const routeParams = []

      if (!isEmpty(incomingQuerystring)) routeParams.push(incomingQuerystring.substring(1))
      if (!isEmpty(pathMatch.params)) routeParams.push(queryString.stringify(pathMatch.params))

      const routeParamsQueryString = routeParams.join('&')

      return `${screenPath}?${routeParamsQueryString}`
    }
  }
}

const getStateFromPath = path => {
  const screenPathWithParams = getScreenPathWithParamsFromPath(path, routesConfig)
  const isAuthorized = getAuthorized(store.getState())

  // 404 handling
  if (!screenPathWithParams) return null

  // Set `returnToOnAuthPath` for routes requiring auth when not auth'd
  if (!isAuthorized && screenPathWithParams.match(new RegExp(`^${AUTH_ROOT_SCREEN_NAME}`))) {
    store.dispatch(setReturnToOnAuthPath(path))
    return null
  }

  return getStateFromPathDefault(screenPathWithParams)
}

// React Navigation linking config
export default {
  prefixes,
  subscribe,
  getStateFromPath,
  getPathFromState: () => {}
}
