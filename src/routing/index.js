import { getStateFromPath } from '@react-navigation/native'
import { match } from 'path-to-regexp'

export const prefixes = [
  'http://hylo.com',
  'http://www.hylo.com',
  'https://hylo.com',
  'https://www.hylo.com',
  'hyloapp://'
]

// Matched params are returned to the matched screen in `route.params`
export const routesConfig = {
  ':context(c|n|all)/:contextId?':                          'AppNavigator/Home/Home',
  ':context(c|n|all)/:contextId/members':                   'AppNavigator/Home/Members',
  ':context(c|n)/:contextId/:topicName':                    'AppNavigator/TopicFeed',
  'm/:id':                                                  'AppNavigator/MemberProfile',
  ':context(c|n)/:contextId/m/:id':                         'AppNavigator/MemberProfile',
  ':context(all)/p/:id':                                    'AppNavigator/PostDetails',
  ':context(c|n)/:contextId/p/:id':                         'AppNavigator/PostDetails',
  'p/:id':                                                  'AppNavigator/PostDetails',
  'p/:id/edit':                                             'AppNavigator/PostEditor',
  ':context(c|n)/:contextId/p/:id/edit':                    'AppNavigator/PostEditor',
  'settings/:section?':                                     'AppNavigator/UserSettings',
  't/:id':                                                  'AppNavigator/Thread',
  // TODO: I don't see a great reason that this              is still a constant
  't':                                                      'AppNavigator/ThreadList',
  'c/:slug/join/:accessCode':                               'AppNavigator/JoinCommunity',
  'h/use-invitation/:token':                                'AppNavigator/JoinCommunity'
  // AuthNavigator route...             
  // 'passwordResetTokenLogin/:userId/:loginToken/:nextURL':   'Login'
}

export const routing = {
  prefixes,
  getStateFromPath: (path, options) => {
    const statePath = matchRouteToScreenPath(path, routesConfig)
    return statePath
      ? getStateFromPath(statePath)
      : getStateFromPath(path, options)
  },
  config: { screens: {} }
}

// Matches path to routes and returns a screen path
// with params appended as a querystring
export function matchRouteToScreenPath (path, routes) {
  for (const pathMatcher in routes) {
    const matched = match(pathMatcher)(path.slice(1, path.length))

    if (matched) {
      const screenPath = routes[pathMatcher]
      const querystring = makeQuerystringFromParams(matched.params)

      return [ screenPath, querystring ].join('?')
    }
  }
}

export function makeQuerystringFromParams (params) {
  const querystringParams = []

  for (const key in params) {
    const value = params[key]
    querystringParams.push([key, value].join('='))
  }

  return querystringParams.join('&')
}

export default routing
