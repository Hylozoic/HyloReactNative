import { getStateFromPath, getPathFromState } from '@react-navigation/native'
import { isString, isArray } from 'lodash/fp'
import { match } from 'path-to-regexp'

// NOTE: A routing config like the below would allow for more a more idiomatic
//       prioritizing of the route matching:
//
// const routesConfig = {
//   '/:context(c|n|all)/:contextId?': ['Main', 'Home'],
//   '/:context(c|n|all)/:contextId/members': ['Main', 'Members'],
//   '/:context(c|n)/:contextId/:topicName': ['TopicFeed']
//   ...
// }
export const routesConfig = {
  DrawerHome: {
    Main: {
      Home: [
        ':context(c|n|all)/:contextId?'
      ],
      Members: [
        ':context(c|n|all)/:contextId/members'
      ]
    },
    TopicFeed: ':context(c|n)/:contextId/:topicName',
    MemberProfile: [
      'm/:id',
      ':context(c|n)/:contextId/m/:id'
    ],
    PostDetails: [
      ':context(all)/p/:id', // does that work? I want it to assign 'all' to context
      ':context(c|n)/:contextId/p/:id',
      'p/:id'
    ],
    PostEditor: [
      'p/:id/edit',
      ':context(c|n)/:contextId/p/:id/edit'
    ],
    UserSettings: 'settings/:section?',
    Thread: 't/:id',
    ThreadList: 't',
    JoinCommunity: 'c/:slug/join/:accessCode',
    UseInvitation: 'h/use-invitation'
    // //   passwordResetTokenLogin: route('/noo/login/token'),
  }
}

export const routing = {
  prefixes: [
    'http://hylo.com',
    'http://www.hylo.com',
    'https://hylo.com',
    'https://www.hylo.com',
    'hyloapp://'
  ],
  getStateFromPath(path) {
    const statePath = getStatePathFromPath(path.slice(1, path.length))
    return statePath && getStateFromPath(statePath)
  },
  // getPathFromState(state, config) {
  //   return getPathFromState(state, config)
  // },
  config: {
    screens: {
      // DrawerHome: {
      //   screens: {
      //     MemberProfile: 'm/:id',
      //     // MemberProfile: 'c/:communitySlug/m/:id',
      //     PostDetails: 'p/:id',
      //     PostEditor: 'p/:id/edit',
      //     UserSettings: 'settings/:section?',
      //     Thread: '/t/:id',
      //     ThreadList: '/t',
      //     // TODO: I don't see a great reason that this is still a constant
      //     Main: {
      //       screens: {
      //         Feed: 'feed/:communityId',
      //         Members: 'members',
      //         TopicFeed: 'c/:communitySlug/topicFeed/:topicName'
      //       }
      //     }
      //   }
      // }
    }
  }
}

// Utility functions to make our routing hack go

export function getStatePathFromPath (linkingPath) {
  const match = findRouteMatch(linkingPath)

  if (!match) return

  const statePath = match.screenStack.join('/')
  const querystringParams = []

  for (const key in match.params) {
    const value = match.params[key]
    querystringParams.push([key, value].join('='))
  }

  return [statePath, querystringParams.join('&')].join('?')
}

export const matcher = (path, config) => match(config, { encode: encodeURI, decode: decodeURIComponent })(path)

export function findRouteMatch (path, routes = routesConfig, screenStack = []) {
  for (const screen in routes) {
    let matched
    const config = routes[screen]
    if (!isArray(config) && !isString(config)) {
      matched = findRouteMatch(path, config, [...screenStack, screen])
    } else {
      matched = matcher(path, config)
    }
    if (matched) {
      return {
        screenStack: [...screenStack, screen],
        ...matched
      }
    }
  }
}

export default routing
