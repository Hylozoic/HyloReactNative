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
  ':context(c|n|all)/:contextId?':             'DrawerHome/Main/Home',
  ':context(c|n|all)/:contextId/members':      'DrawerHome/Main/Members',
  ':context(c|n)/:contextId/:topicName':       'DrawerHome/TopicFeed',
  'm/:id':                                     'DrawerHome/MemberProfile',
  ':context(c|n)/:contextId/m/:id':            'DrawerHome/MemberProfile',
  ':context(all)/p/:id':                       'DrawerHome/PostDetails',
  ':context(c|n)/:contextId/p/:id':            'DrawerHome/PostDetails',
  'p/:id':                                     'DrawerHome/PostDetails',
  'p/:id/edit':                                'DrawerHome/PostEditor',
  ':context(c|n)/:contextId/p/:id/edit':       'DrawerHome/PostEditor',
  'settings/:section?':                        'DrawerHome/UserSettings',
  't/:id':                                     'DrawerHome/Thread',
  // TODO: I don't see a great reason that this is still a constant
  't':                                         'DrawerHome/ThreadList',
  'c/:slug/join/:accessCode':                  'DrawerHome/JoinCommunity',
  'h/use-invitation':                          'DrawerHome/UseInvitation'
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

// Fragments of earlier, also good, solutions:
// 
// DrawerHome: {
//   screens: {
//     MemberProfile: 'm/:id',
//     // MemberProfile: 'c/:communitySlug/m/:id',
//     PostDetails: 'p/:id',
//     PostEditor: 'p/:id/edit',
//     UserSettings: 'settings/:section?',
//     Thread: '/t/:id',
//     ThreadList: '/t',
//     Main: {
//       screens: {
//         Feed: 'feed/:communityId',
//         Members: 'members',
//         TopicFeed: 'c/:communitySlug/topicFeed/:topicName'
//       }
//     }
//   }
// }

// export const routesConfig = {
//   DrawerHome: {
//     Main: {
//       Home: [
//         ':context(c|n|all)/:contextId?'
//       ],
//       Members: [
//         ':context(c|n|all)/:contextId/members'
//       ]
//     },
//     TopicFeed: ':context(c|n)/:contextId/:topicName',
//     MemberProfile: [
//       'm/:id',
//       ':context(c|n)/:contextId/m/:id'
//     ],
//     PostDetails: [
//       ':context(all)/p/:id',
//       ':context(c|n)/:contextId/p/:id',
//       'p/:id'
//     ],
//     PostEditor: [
//       'p/:id/edit',
//       ':context(c|n)/:contextId/p/:id/edit'
//     ],
//     UserSettings: 'settings/:section?',
//     Thread: 't/:id',
//     ThreadList: 't',
//     JoinCommunity: 'c/:slug/join/:accessCode',
//     UseInvitation: 'h/use-invitation'
//     // //   passwordResetTokenLogin: route('/noo/login/token'),
//   }
// }

// export function getStatePathFromPath (linkingPath) {
//   const match = findRouteMatch(linkingPath)

//   if (!match) return

//   const statePath = match.screenStack.join('/')
//   const querystringParams = []

//   for (const key in match.params) {
//     const value = match.params[key]
//     querystringParams.push([key, value].join('='))
//   }

//   return [statePath, querystringParams.join('&')].join('?')
// }

// export const matcher = (path, config) => match(config, { encode: encodeURI, decode: decodeURIComponent })(path)

// export function findRouteMatch (path, routes = routesConfig, screenStack = []) {
//   for (const screen in routes) {
//     let matched
//     const config = routes[screen]
//     if (!isArray(config) && !isString(config)) {
//       matched = findRouteMatch(path, config, [...screenStack, screen])
//     } else {
//       matched = matcher(path, config)
//     }
//     if (matched) {
//       return {
//         screenStack: [...screenStack, screen],
//         ...matched
//       }
//     }
//   }
// }
