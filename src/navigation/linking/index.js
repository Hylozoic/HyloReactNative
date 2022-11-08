import { Linking } from 'react-native'
import { isEmpty } from 'lodash/fp'
import {
  getActionFromState,
  subscribe,
  getStateFromPath as getStateFromPathDefault,
  CommonActions
} from '@react-navigation/native'
import { match } from 'path-to-regexp'
import { URL } from 'react-native-url-polyfill'
import * as queryString from 'query-string'
import { PathHelpers, PUBLIC_CONTEXT_SLUG } from 'hylo-shared'
import store from 'store'
import { modalScreenName } from 'hooks/useIsModalScreen'
import { getAuthorized } from 'store/selectors/getAuthState'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import { navigationRef } from 'navigation/linking/helpers'

/*

Hylo Custom link routing config and related utilities:

The current version of `react-navigation` doesn't have a way to map multiple paths
to the same screen. The below way of mapping screens to paths is being used to
construct and, otherwise in alternate to, the default `linking.config.screens` config.
See: https://reactnavigation.org/docs/configuring-links/

All routes are always available, but routes that begin with `AUTH_ROOT_SCREEN_NAME`
will be set as the `returnToPath` and not navigated to until after
the user is authorized (see `getAuthState`).

NOTE: The linking route paths below are equivalent to `exact` route paths in
React Router (web)

*/

export const AUTH_ROOT_SCREEN_NAME = 'AuthRoot'
export const NON_AUTH_ROOT_SCREEN_NAME = 'NonAuthRoot'

/* eslint-disable key-spacing */
export const routingConfig = {
  '/login':                                                  `${NON_AUTH_ROOT_SCREEN_NAME}/Login`,
  '/signup/:step(verify-email)':                             `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/SignupEmailValidation`,
  '/signup/:step?':                                          `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/Signup Intro`,
  '/signup':                                                 `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/Signup Intro`,
  '/noo/login/(jwt|token)':                                  'LoginByTokenHandler',
  '/h/use-invitation':                                       'JoinGroup',
  '/:context(groups)/:groupSlug/join/:accessCode':           'JoinGroup',

  '/hylo-editor':                                            `${AUTH_ROOT_SCREEN_NAME}/HyloEditor`,

  // context group routes (/all, /public)
  '/:groupSlug(all|public)':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab`,
  '/:groupSlug(all|public)/post/:id':                        `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:groupSlug(all)/members/:id':                            `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Member`,
  '/:groupSlug(all)/topics/:topicName':                      `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,

  // map routes
  '/:groupSlug(all|public)/map':                             `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Map`,
  '/:context(groups)/:groupSlug/map':                        `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Map`,
  '/:context(groups)/:groupSlug/map/create':                 `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  // /groups
  '/:context(groups)/:groupSlug/settings/invite':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Invite`,
  '/:context(groups)/:groupSlug/settings/requests':          `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Join Requests`,
  '/:context(groups)/:groupSlug/settings/relationships':     `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Related Groups`,
  '/:context(groups)/:groupSlug/settings/export':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Export Data`,
  '/:context(groups)/:groupSlug/settings/delete':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Delete`,
  '/:context(groups)/:groupSlug/settings':                   `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Settings`,
  '/:context(groups)/:groupSlug/groups':                     `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Group Relationships`,
  '/:context(groups)/:groupSlug/topics/:topicName':          `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,
  '/:context(groups)/:groupSlug/members/:id':                `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Member`,
  '/:context(groups)/:groupSlug/members':                    `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Members`,
  '/:context(groups)/:groupSlug':                            `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,
  '/:context(groups)/:groupSlug/post/:id':                   `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:context(groups)/:groupSlug/post/:id/edit':              `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  // /settings
  '/settings':                                               `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Edit Profile`,
  '/settings/account':                                       `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Account`,
  '/settings/notifications':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Notifications`,
  '/settings/blocked-users':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Blocked Users`,
  '/settings/:section?':                                     `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Edit Profile`,

  // /messages
  '/messages/new':                                           `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/New Message`,
  '/messages/:id':                                           `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/Thread`,
  '/messages':                                               `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/Messages`,

  // catch-alls
  '(.*)/group/:groupSlug':                                   `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Group Explore')}`,
  '(.*)/members/:id':                                        `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Member')}`,
  '(.*)/post/:id':                                           `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Post Details')}`,
  '(.*)/create/group':                                       `${AUTH_ROOT_SCREEN_NAME}/Create Group`,
  '(.*)/create/post':                                        `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,
  '(.*)/post/:id/edit':                                      `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  '/':                                                       `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`
}

// Even though these are already on the respective navigators,
// they need to be specified again when linking.
// NOTE/TODO: Though initial screens are an array currently, only the first screen name will be used
// according to the limitations of using React Navigation Linking Screen Config. Sad trumpet.
export const initialRouteNamesConfig = {
  [AUTH_ROOT_SCREEN_NAME]: ['Drawer'],
  'Home Tab': ['Group Navigation', 'Feed'],
  'Messages Tab': ['Messages']
}

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

// tracks: `hylo/hylo-evo/src/server/proxy/constants.js#staticPages`
export const staticPages = [
  '',
  '/help',
  '/help/markdown',
  '/about',
  '/about/careers',
  '/about/contact',
  '/about/team',
  '/evolve',
  '/invite-expired',
  '/subscribe',
  '/styleguide',
  '/team',
  '/terms',
  '/terms/privacy',
  '/newapp'
]

// Could potentially be entirely replaced by `navigateToLinkingPath` below
// The key differentiating feature besides the routes is the ability to provide
// a `groupSlug` which is used in the case of the HyloEditorWebView
export async function openURL (providedURLOrPath, options = {}) {
  const linkingURL = new URL(providedURLOrPath.trim(), DEFAULT_APP_HOST)

  if (
    prefixes.includes(linkingURL.origin) &&
    !staticPages.includes(linkingURL.pathname.toLowerCase())
  ) {
    const pathname = linkingURL.pathname.toLowerCase()
    const { length, [length - 2]: prefix, [length - 1]: suffix } = pathname.split('/')

    switch (prefix) {
      case 'members': {
        return navigateToLinkingPath(PathHelpers.mentionPath(suffix, options?.groupSlug || PUBLIC_CONTEXT_SLUG))
      }
      case 'topics': {
        return navigateToLinkingPath(PathHelpers.topicPath(suffix, options?.groupSlug || PUBLIC_CONTEXT_SLUG))
      }
    }

    return navigateToLinkingPath(pathname)
  }

  if (await Linking.canOpenURL(linkingURL)) {
    return Linking.openURL(linkingURL)
  }
}

// This could possibly be replaced by updating the logic applied by Linking.openURL
export const navigateToLinkingPath = async (providedPath, reset) => {
  const linkingURL = new URL(providedPath.trim(), DEFAULT_APP_HOST)
  const linkingPath = linkingURL.pathname + linkingURL.search
  const stateForPath = getStateFromPath(linkingPath)

  if (stateForPath) {
    const actionForPath = getActionFromState(stateForPath)

    if (reset) {
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
}

export function screenAndRoutePathFromPath (path, routes = routingConfig) {
  const {
    pathname: incomingPathname,
    search: incomingQuerystring
  } = new URL(path, DEFAULT_APP_HOST)

  for (const pathMatcher in routes) {
    const pathMatch = match(pathMatcher)(incomingPathname)

    if (pathMatch) {
      const screenPath = routes[pathMatcher]
      const routeParams = []

      if (!isEmpty(incomingQuerystring)) routeParams.push(incomingQuerystring.substring(1))
      if (!isEmpty(pathMatch.params)) routeParams.push(queryString.stringify(pathMatch.params))

      // Needed for JoinGroup
      routeParams.push(`originalLinkingPath=${encodeURIComponent(path)}`)

      const routeParamsQueryString = routeParams.join('&')

      return {
        screenPath: `${screenPath}?${routeParamsQueryString}`,
        routePath: `${incomingPathname}?${routeParamsQueryString}`
      }
    }
  }
}

export function linkingConfigForScreenPath (screenPath) {
  const screenPathSegments = screenPath.split('/')
  const makeScreenConfig = (screenNames, screenConfig = {}) => {
    const screenName = screenNames.pop()
    const initialRouteName = Object.keys(initialRouteNamesConfig).includes(screenName)

    if (initialRouteName) {
      screenConfig.initialRouteName = initialRouteNamesConfig[screenName][0]
    }

    if (Object.keys(screenConfig).length === 0) {
      screenConfig = {
        screens: {
          [screenName]: '*'
        }
      }
    } else {
      screenConfig = {
        screens: {
          [screenName]: screenConfig
        }
      }
    }

    return screenNames.length > 0
      ? makeScreenConfig(screenNames, screenConfig)
      : screenConfig
  }

  return makeScreenConfig(screenPathSegments)
}

export const getStateFromPath = path => {
  const { routePath, screenPath } = screenAndRoutePathFromPath(path, routingConfig)
  const screenConfig = linkingConfigForScreenPath(screenPath)
  const isAuthorized = getAuthorized(store.getState())

  // 404 handling
  if (!routePath) return null

  // Set `returnToOnAuthPath` for routes requiring auth when not auth'd
  if (!isAuthorized && routePath.match(new RegExp(`^${AUTH_ROOT_SCREEN_NAME}`))) {
    store.dispatch(setReturnToOnAuthPath(path))

    return null
  }

  return getStateFromPathDefault(routePath, screenConfig)
}

// React Navigation linking config
export default {
  prefixes,
  subscribe,
  getStateFromPath,
  getPathFromState: () => {}
}

// The actual initial state we want?
// export const initialNavigationState = {
//   routes: [
//     {
//       [AUTH_ROOT_SCREEN_NAME]: {
//         name: 'Drawer',
//         routes: [
//           {
//             name: 'Tabs',
//             routes: [
//               {
//                 name: 'Home Tab',
//                 routes: [
//                   { name: 'Group Navigation' }
//                 ]
//               },
//               {
//                 name: 'Messages Tab',
//                 routes: [
//                   { name: 'Messages' }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     }
//   ]
// }

// const experimentalExtraScreenConfig = {
//   screens: {
//     [AUTH_ROOT_SCREEN_NAME]: {
//       initialRouteName: 'Drawer',
//       screens: {
//         Drawer: {
//           initialRouteName: 'Tabs',
//           screens: {
//             Tabs: {
//               initialRouteName: 'Home Tab',
//               screens: {
//                 'Home Tab': {
//                   initialRouteName: 'Feed'
//                 },
//                 'Messages Tab': {
//                   initialRouteName: 'Messages'
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

/*

CAUTION: This mostly assumes that the target screen will be the only thing
initially in the state at this point. This always true with our current
React Navigation use.

However, this may be brittle with certain React Navigation elaborations including
if we begin to maintain a deeper navigation history which includes multiple
instances of the same screen in the history (e.g. Feed > Post Details > Feed)

Ideally we'd not need this at all and use the React Navigation provided method
for configuring linking to require a single initial screen. We are not able to use
the standard linking configuration as it having multiple paths to a single screen
in that configuration is not possible (* or very awkward to configure and maintain).

* Injecting the initial screens could potentially be better achieved through a more
idiomatic deep traversal and merging of the React Navigation state object.

*/
// function addInitialRouteNamesIntoState (stateWithoutInitials, initialRouteNamesMap = initialRouteNamesConfig) {
//   function recurseObject (state) {
//     state?.routes?.forEach(route => {
//       if (!route.state?.routes) return route

//       if (route?.name && Object.keys(initialRouteNamesMap).includes(route.name)) {
//         route.state.routes = [
//           ...initialRouteNamesMap[route.name]
//             .filter(initialRouteName => {
//               const routeNamesAlreadyPresent = route.state.routes.map(route => route.name)

//               return !routeNamesAlreadyPresent.includes(initialRouteName)
//             })
//             .map(initialRouteName => ({
//               name: initialRouteName,
//               params: route.state.routes[route.state.routes.length - 1].params
//             })),
//           ...route.state.routes
//         ]
//       }

//       return recurseObject(route)
//     })
//   }

//   return cloneDeepWith(recurseObject, stateWithoutInitials)
// }
