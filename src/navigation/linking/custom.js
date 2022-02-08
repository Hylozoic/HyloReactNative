import { Linking } from 'react-native'
import { isString, reject } from 'lodash/fp'
import {
  getActionFromState,
  CommonActions,
  getStateFromPath as getStateFromPathDefault
} from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'
import store from 'store'
import { modalScreenName } from './helpers'
import setReturnToPath from 'store/actions/setReturnToPath'
import { navigationRef } from 'navigation/RootView/RootView'
import { URL } from 'url'

/* eslint-disable key-spacing */

export const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
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

export const routesConfig = {
  '/noo/login/token':                                        { screenPath: 'LoginByTokenHandler', noAuth: true },
  '/signup/finish':                                          { screenPath: 'Signup/SignupFlow0', noAuth: true },
  '/signup/:step?':                                          { screenPath: 'Signup/Signup Intro', noAuth: true },
  '/h/use-invitation':                                       'JoinGroup',

  // /members
  '/members/:id':                                            modalScreenName('Member'),
  '/members':                                                'Drawer/Tabs/Home Tab/Members',

  // special group routes (/all, /public)
  '/:groupSlug(all|public)':                                 { screenPath: 'Drawer/Tabs/Home Tab/Feed', context: 'groups' },
  '/:groupSlug(all)/members/:id':                            { screenPath: modalScreenName('Member'), context: 'groups' },

  // map routes
  '/:groupSlug(all|public)/map':                             { screenPath: 'Drawer/Tabs/Home Tab/Map', context: 'groups' },
  '/:context(groups)/:groupSlug/map':                        'Drawer/Tabs/Home Tab/Map',
  '/:groupSlug(all|public)/map/post/:id':                    { screenPath: modalScreenName('Post Details'), context: 'groups' },
  '/:context(groups)/:groupSlug/map/post/:id':               modalScreenName('Post Details'),
  '/:context(groups)/:groupSlug/detail':                     modalScreenName('Group Detail'),

  // /groups
  '/:context(groups)/:groupSlug/join/:accessCode':           'JoinGroup',
  '/:context(groups)/:groupSlug/settings/invite':            'Group Settings/Invite',
  '/:context(groups)/:groupSlug/settings/requests':          'Group Settings/Join Requests',
  '/:context(groups)/:groupSlug/settings/relationships':     'Group Settings/Related Groups',
  '/:context(groups)/:groupSlug/settings/export':            'Group Settings/Export Data',
  '/:context(groups)/:groupSlug/settings/delete':            'Group Settings/Delete',
  '/:context(groups)/:groupSlug/settings':                   'Group Settings/Settings',
  '/:context(groups)/:groupSlug/groups':                     'Drawer/Tabs/Home Tab/Group Relationships',
  '/:context(groups)/:groupSlug/topics/:topicName':          'Drawer/Tabs/Home Tab/Topic Feed',
  '/:context(groups)/:groupSlug/members/:id':                'Drawer/Tabs/Home Tab/Member',
  '/:context(groups)/:groupSlug':                            'Drawer/Tabs/Home Tab/Feed',
  '/:context(groups)/:groupSlug/post/:id':                   'Drawer/Tabs/Home Tab/Post Details',
  '/:context(groups)/post/:id':                              'Drawer/Tabs/Home Tab/Post Details',
  '/:context(groups)/:groupSlug/post/:id/edit':              'Edit Post',

  // /post
  '/post/:id':                                               modalScreenName('Post Details'),
  '/post/:id/edit':                                          'Edit Post',

  // /settings
  '/settings/account':                                       'Drawer/Tabs/Settings Tab/Account',
  '/settings/:section?':                                     'Drawer/Tabs/Settings Tab/Edit Profile',

  // /messages
  '/messages/:id':                                           'Drawer/Tabs/Messages Tab/Thread',
  '/messages':                                               'Drawer/Tabs/Messages Tab/Messages',

  '/all':                                                    'Drawer/Tabs/Home Tab/Feed',
  '/':                                                       'Drawer/Tabs/Home Tab/Feed',
}

export const INITIAL_NAV_STATE = {
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

// TODO: For MapWebView nav... Rename or possibly move closer to MapWebView?
// another possibility is to update logic applied by Linking.openURL
// to not always force nav state reset to default (or storing returnTo URL?) for
// this case...
export const navigateToLinkingPathInApp = async (providedUrl, reset = false) => {
  const linkingPath = URL.parse(providedUrl)?.path
  const state = getStateFromPath(linkingPath)
  const action = getActionFromState(state)
  if (reset) {
    await navigationRef.current?.dispatch(CommonActions.reset(INITIAL_NAV_STATE))
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
      await navigationRef.current?.dispatch(CommonActions.reset(INITIAL_NAV_STATE))
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
        options: { ...options, ...pathMatch.params },
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
    store.dispatch(setReturnToPath(url))
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
