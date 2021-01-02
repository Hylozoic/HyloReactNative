import { getStateFromPath } from '@react-navigation/native'
import { match } from 'path-to-regexp'
import * as qs from 'query-string'

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

export const routing = {
  prefixes,
  getStateFromPath: path => {
    const matchedStatePath = matchRouteToScreenPath(path, routesConfig)
    const statePath = matchedStatePath || path

    return getStateFromPath(statePath)
  },
  getPathFromState: () => {}
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

export default routing

// TODO: Leftover notes... Delete
// export const ROUTE_NOT_FOUND_SCREEN = 'RouteNotFound'
// if (navigationState?.routes[0]?.name == ROUTE_NOT_FOUND_SCREEN) {
//   navigationState.routes[0].params = {
//     notFoundPathAndQuery: statePath
//   } 
// }

// // No match found
// const screenPath = ROUTE_NOT_FOUND_SCREEN
// const routeParams = { notFoundPathAndQuery: incomingPathAndQuery }
// const routeParamsQueryString = qs.stringify(routeParams, {
//   encode: true,
//   strict: true
// })

// return [screenPath, routeParamsQueryString].join('?')