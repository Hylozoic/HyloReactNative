import { Linking } from 'react-native'
import { isString, reject } from 'lodash/fp'
import {
  getActionFromState,
  CommonActions,
  getStateFromPath as getStateFromPathDefault
} from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'
import { URL } from 'react-native-url-polyfill'
import { PathHelpers } from 'hylo-shared'
import store from 'store'
import { getAuthorized } from 'store/selectors/getAuthState'
import setReturnToPath from 'store/actions/setReturnToPath'
import { modalScreenName } from './helpers'
import { ALL_GROUP_ID } from 'store/models/Group'
import { navigationRef } from 'navigation/linking/helpers'

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
//  1) { screenPath: 'path/to/screen', noAuth: (true|false) }
//  2) 'path/to/screen' (assumed auth required)
//

/* eslint-disable key-spacing */
export const routesConfig = {
  // TODO: Change back to `/noo/login/(jwt|token)` once evo is deployed allowing this URL
  '/login/(jwt|token)':                                      { screenPath: 'LoginByTokenHandler', noAuth: true },
  '/login':                                                  { screenPath: 'NonAuthRoot/Login', noAuth: true },
  '/signup/verify-email':                                    { screenPath: 'NonAuthRoot/Signup/SignupEmailValidation', noAuth: true },
  '/signup/:step?':                                          { screenPath: 'NonAuthRoot/Signup/Signup Intro', noAuth: true },
  '/h/use-invitation':                                       'JoinGroup',

  // /members
  '/members/:id':                                            `AuthRoot/${modalScreenName('Member')}`,
  '/members':                                                'AuthRoot/Drawer/Tabs/Home Tab/Members',

  // special group routes (/all, /public)
  '/:groupSlug(all|public)':                                 { screenPath: 'AuthRoot/Drawer/Tabs/Home Tab/Feed', groupId: ALL_GROUP_ID, context: 'groups' },
  '/:groupSlug(all)/members/:id':                            { screenPath: 'AuthRoot/Drawer/Tabs/Home Tab/Member', groupId: ALL_GROUP_ID, context: 'groups' },
  '/:groupSlug(all)/topics/:topicName':                      { screenPath: 'AuthRoot/Drawer/Tabs/Home Tab/Topic Feed', groupId: ALL_GROUP_ID, context: 'groups' },

  // map routes
  '/:groupSlug(all|public)/map':                             { screenPath: 'AuthRoot/Drawer/Tabs/Home Tab/Map', groupId: ALL_GROUP_ID, context: 'groups' },
  '/:context(groups)/:groupSlug/map':                        'AuthRoot/Drawer/Tabs/Home Tab/Map',
  '/:groupSlug(all|public)/map/post/:id':                    { screenPath: `AuthRoot/${modalScreenName('Post Details')}`, groupId: ALL_GROUP_ID, context: 'groups' },
  '/:context(groups)/:groupSlug/map/post/:id':               `AuthRoot/${modalScreenName('Post Details')}`,
  '/:context(groups)/:groupSlug/detail':                     `AuthRoot/${modalScreenName('Group Detail')}`,

  // /groups
  '/:context(groups)/:groupSlug/join/:accessCode':           'JoinGroup',
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
}

export const INITIAL_AUTH_NAV_STATE = {
  routes: [
    {
      name: 'AuthRoot',
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

export const INITIAL_NON_AUTH_NAV_STATE = {
  routes: [
    {
      name: 'NonAuthRoot',
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

export async function openURL (providedUrlOrPath, options = {}) {
  const urlOrPath = providedUrlOrPath.trim().toLowerCase()
  const linkingURL = new URL(urlOrPath, DEFAULT_APP_HOST)

  if (prefixes.includes(linkingURL.origin)) {
    const { length, [length - 2]: prefix, [length - 1]: suffix } = linkingURL.pathname.split('/')

    switch (prefix) {
      case 'members':
      case 'm':
      case 'u': {
        return navigateToLinkingPathInApp(PathHelpers.mentionPath(suffix, options?.groupSlug))
      }
      case 'topics':
      case 'tag': {
        return navigateToLinkingPathInApp(PathHelpers.topicPath(suffix, options?.groupSlug))
      }
    }

    return navigateToLinkingPathInApp(linkingURL.pathname)
  }

  if (await Linking.canOpenURL(urlOrPath)) {
    return Linking.openURL(urlOrPath)
  }
}

// This could possibly be replaced by updating the logic applied by Linking.openURL
// to not always force nav state reset to default (or storing returnTo URL?) for
// this case...
export const navigateToLinkingPathInApp = async (providedUrl, reset = false) => {
  const linkingURL = new URL(providedUrl, DEFAULT_APP_HOST)
  const linkingPath = `${linkingURL.pathname}${linkingURL.search}`
  const isAuthorized = getAuthorized(store.getState())
  const state = getStateFromPath(linkingPath)
  const action = getActionFromState(state)

  if (reset) {
    await navigationRef.current?.dispatch(
      CommonActions.reset(isAuthorized
        ? INITIAL_AUTH_NAV_STATE
        : INITIAL_NON_AUTH_NAV_STATE
      )
    )
  }

  navigationRef.current?.dispatch(action)
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
      await navigationRef.current?.dispatch(CommonActions.reset(INITIAL_AUTH_NAV_STATE))
    }
    await navigationRef.current?.dispatch(action)
    store.dispatch(setReturnToPath(null))
  }
}

export function getRouteObjectFromPath (incomingPathAndQuerystring, routes = routesConfig) {
  const [incomingPath, incomingQuerystring] = incomingPathAndQuerystring.split('?')

  for (const pathMatcher in routes) {
    const pathMatch = match(pathMatcher)(incomingPath)

    if (pathMatch) {
      const routeMatchWithOptions = routes[pathMatcher]
      let screenPath = routeMatchWithOptions
      let options = {}

      // Collecting custom route options if present
      if (!isString(routeMatchWithOptions)) {
        screenPath = routeMatchWithOptions?.screenPath
        options = reject('screenPath', routeMatchWithOptions)
      }

      return {
        screenPath,
        options: { ...options, originalLinkingPath: incomingPathAndQuerystring, ...pathMatch.params },
        queryString: incomingQuerystring
      }
    }
  }
}

// Matches path to routes and returns a react-navigation screen path
// (accordingly params appended as a querystring)
export function getScreenPathWithQuerystring (incomingPathAndQuerystring) {
  const routeObject = getRouteObjectFromPath(incomingPathAndQuerystring)
  if (routeObject) {
    const { screenPath, options, queryString } = routeObject
    const optionsQueryString = qs.stringify(options, {
      encode: true,
      strict: true
    })
    const fullQuerystring = [optionsQueryString, queryString]
      .filter(Boolean)
      .join('&')

    return [screenPath, fullQuerystring]
      .filter(Boolean)
      .join('?')
  }
}

// This function intentionally doesn't return to have which
// has the effect of disabling the default initialURL handling
const getInitialURL = async () => {
  const initialURL = await Linking.getInitialURL()

  if (initialURL) store.dispatch(setReturnToPath(initialURL))
}

const subscribe = listener => {
  const onReceiveURL = ({ url }) => {
    console.log('!!! url in subscribe -- would be setting returnToPath', url)
    // store.dispatch(setReturnToPath(url))
    return listener(url)
  }

  const eventSubscription = Linking.addEventListener('url', onReceiveURL)

  return () => eventSubscription.remove()
}

const getStateFromPath = path => {
  const statePath = getScreenPathWithQuerystring(path, routesConfig)
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
