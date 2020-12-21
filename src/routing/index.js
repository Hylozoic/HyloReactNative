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
  /// TODO: I don't see a great reason that this              is still a constant
  '/t':                                                      'AppNavigator/ThreadList',
  '/c/:slug/join/:accessCode':                               'AppNavigator/JoinCommunity',
  '/h/use-invitation/:token':                                'AppNavigator/JoinCommunity'
  // AuthNavigator route...             
  // 'passwordResetTokenLogin/:userId/:loginToken/:nextURL':   'Login'
}

export const routing = {
  prefixes,
  getStateFromPath: path => {
    const matchedStatePath = matchRouteToScreenPath(path, routesConfig)
    const statePath = matchedStatePath
      ? matchedStatePath
      : path
    return getStateFromPath(statePath)
  },
  getPathFromState: () => {}
}

// Matches path to routes and returns a screen path
// with params appended as a querystring
export function matchRouteToScreenPath (path, routes) {
  for (const pathMatcher in routes) {
    const matched = match(pathMatcher)(path)

    if (matched) {
      const screenPath = routes[pathMatcher]      
      const querystring = qs.stringify(matched.params, {
        encode: true,
        strict: true
      })

      return [ screenPath, querystring ].join('?')
    }
  }
}

export default routing
