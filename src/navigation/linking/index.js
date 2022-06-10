import { Linking } from 'react-native'
import { isEmpty, set } from 'lodash/fp'
import {
  getActionFromState,
  subscribe,
  getInitialURL,
  getStateFromPath as getStateFromPathDefault,
  CommonActions
} from '@react-navigation/native'
import { match } from 'path-to-regexp'
import { URL } from 'react-native-url-polyfill'
import * as queryString from 'query-string'
import { PathHelpers, PUBLIC_CONTEXT_SLUG } from 'hylo-shared'
import store from 'store'
import { getAuthorized } from 'store/selectors/getAuthState'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import { navigationRef } from 'navigation/linking/helpers'
import { modalScreenName } from './helpers'

// Hylo Custom link routing config and related utilities:
//
// The current version of `react-navigation` doesn't have a way to map multiple paths
// to the same screen. The below way of mapping screens to paths is being used in to
// construct and, otherwise in alternate to, the default `config.screens` config.
//
// All routes are always available but routes that begin with `AUTH_ROOT_SCREEN_NAME`
// will be set as the `returnToPath` and not navigated to until after
// the user is authorized (see `getAuthState`).
//
// NOTE: The linking route paths below are equivilant to `exact` route paths in
// React Router (web)

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

export const AUTH_ROOT_SCREEN_NAME = 'AuthRoot'
export const NON_AUTH_ROOT_SCREEN_NAME = 'NonAuthRoot'

/* eslint-disable key-spacing */
export const routesConfig = {
  '/login':                                                  `${NON_AUTH_ROOT_SCREEN_NAME}/Login`,
  '/signup/:step(verify-email)':                             `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/SignupEmailValidation`,
  '/signup/:step?':                                          `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/Signup Intro`,
  '/signup':                                                 `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/Signup Intro`,
  '/noo/login/(jwt|token)':                                  'LoginByTokenHandler',
  '/h/use-invitation':                                       'JoinGroup',
  '/:context(groups)/:groupSlug/join/:accessCode':           'JoinGroup',

  // /members
  '/members/:id':                                            `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Member')}`,
  '/members':                                                `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Members`,

  // special group routes (/all, /public)
  '/:groupSlug(all|public)':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,
  '/:groupSlug(all|public)/post/:id':                        `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:groupSlug(all)/members/:id':                            `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Member`,
  '/:groupSlug(all)/topics/:topicName':                      `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Topic Feed`,

  // map routes
  '/:groupSlug(all|public)/map':                             `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Map`,
  '/:groupSlug(all|public)/map/post/:id':                    `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Post Details')}`,
  '/:ignored(all|public)/map/group/:groupSlug':              `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Group Detail')}`,
  '/:context(groups)/:groupSlug/map':                        `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Map`,
  '/:context(groups)/:groupSlug/map/post/:id':               `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Post Details')}`,
  '/:context(groups)/:groupSlug/map/create':                 `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,
  '/:context(groups)/:groupSlug/detail':                     `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Group Detail')}`,
  '/:context(groups)/:ignored/map/group/:groupSlug':         `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Group Detail')}`,

  // /groups
  '/:context(groups)/:groupSlug/settings/invite':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Invite`,
  '/:context(groups)/:groupSlug/settings/requests':          `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Join Requests`,
  '/:context(groups)/:groupSlug/settings/relationships':     `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Related Groups`,
  '/:context(groups)/:groupSlug/settings/export':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Export Data`,
  '/:context(groups)/:groupSlug/settings/delete':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Delete`,
  '/:context(groups)/:groupSlug/settings':                   `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Settings`,
  '/:context(groups)/:groupSlug/groups':                     `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Group Relationships`,
  '/:context(groups)/:groupSlug/topics/:topicName':          `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Topic Feed`,
  '/:context(groups)/:groupSlug/members/:id':                `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Member`,
  '/:context(groups)/:groupSlug':                            `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,
  '/:context(groups)/:groupSlug/post/:id':                   `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:context(groups)/post/:id':                              `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:context(groups)/:groupSlug/post/:id/edit':              `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  // /post
  '/post/:id':                                               `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Post Details')}`,
  '/post/:id/edit':                                          `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  // /settings
  '/settings/account':                                       `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Account`,
  '/settings/:section?':                                     `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Edit Profile`,

  // /messages
  '/messages/new':                                           `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('New Message')}`,
  '/messages/:id':                                           `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Thread')}`,
  '/messages':                                               `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/Messages`,

  '/':                                                       `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`
}

// Could potentially be entirely replaced by `navigateToLinkingPath` below
// by adding these legacy routes in the routing above. The key differentiating
// feature besides the rourtes is the ability to provide a `groupSlug`.
export async function openURL (providedUrlOrPath, options = {}) {
  const urlOrPath = providedUrlOrPath.trim()
  const linkingURL = new URL(urlOrPath, DEFAULT_APP_HOST)

  if (prefixes.includes(linkingURL.origin)) {
    const pathname = linkingURL.pathname.toLowerCase()
    const { length, [length - 2]: prefix, [length - 1]: suffix } = pathname.split('/')

    switch (prefix) {
      case 'members':
      case 'm':
      case 'u': {
        return navigateToLinkingPath(PathHelpers.mentionPath(suffix, options?.groupSlug || PUBLIC_CONTEXT_SLUG))
      }
      case 'topics':
      case 'tag': {
        return navigateToLinkingPath(PathHelpers.topicPath(suffix, options?.groupSlug || PUBLIC_CONTEXT_SLUG))
      }
    }

    return navigateToLinkingPath(pathname)
  }

  if (await Linking.canOpenURL(urlOrPath)) {
    return Linking.openURL(urlOrPath)
  }
}

const screenLevelInState = (navState, targetScreenName = 'Feed', level = 0) => {
  level += 1

  if (navState?.screen === targetScreenName || navState?.name === targetScreenName) {
    return level
  }

  if (navState?.params) {
    return screenLevelInState(navState.params, targetScreenName, level)
  } else {
    return 0
  }
}

// This could possibly be replaced by updating the logic applied by Linking.openURL
export const navigateToLinkingPath = async (providedUrl, reset) => {
  const linkingURL = new URL(providedUrl, DEFAULT_APP_HOST)
  const linkingPath = `${linkingURL.pathname}${linkingURL.search}`
  const stateForPath = getStateFromPath(linkingPath)

  if (stateForPath) {
    let actionForPath = getActionFromState(stateForPath)

    if (reset) {
      const feedScreenLevel = screenLevelInState(actionForPath.payload, 'Feed')

      if (feedScreenLevel !== 0) {
        // This maintains `Group Navigation` as the the initial screen while on Home Tab
        // in particular when navigating to the `Feed` from links.
        // Same as this, but dynamic: `actionForPath.pyload.params.params.params.params.initial = false`
        actionForPath = set(`payload${'.params'.repeat(feedScreenLevel - 1)}.initial`, false, actionForPath)
      }
      return navigationRef.dispatch(
        CommonActions.reset({
          routes: [actionForPath.payload]
        })
      )
    }

    return navigationRef.dispatch(actionForPath)
  } else {
    return null
  }
  // Note: If issues with `isReady` on initial app load of `initialURL` wrap all of
  // the above as below:
  //
  // const linkingFunc = () => {
  // // ALL OF THE ABOVE HERE
  // }
  //
  // if (navigationRef.isReady()) {
  //   linkingFunc()
  // } else {
  //   window.setTimeout(linkingFunc, 100)
  // }
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

      // For now required by JoinGroup
      routeParams.push(`originalLinkingPath=${encodeURIComponent(incomingPathAndQuerystring)}`)

      const routeParamsQueryString = routeParams.join('&')

      return `${screenPath}?${routeParamsQueryString}`
    }
  }
}

export const getStateFromPath = path => {
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
  getInitialURL,
  getStateFromPath,
  getPathFromState: () => {}
}
