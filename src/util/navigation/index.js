/**
 * @providesModule util/navigation
 */

import { NavigationActions, StackActions } from 'react-navigation'
import url from 'url'
import pathMatch from 'path-match'
import { get } from 'lodash/fp'

export const MAIN_ROUTE_NAME = 'Main'
export const MAIN_ROUTE_PATH = 'main'

export function resetToAuthRoute (navigation, routeName) {
  return navigation.dispatch({
    type: 'Navigation/NAVIGATE',
    routeName: 'AuthNavigator',
    action: {
      type: 'Navigation/NAVIGATE',
      routeName: routeName
    }
  })
}

export function resetToAppRoute (navigation, routeName) {
  return navigation.dispatch({
    type: 'Navigation/NAVIGATE',
    routeName: 'AppNavigator',
    action: {
      type: 'Navigation/NAVIGATE',
      routeName: routeName
    }
  })
}

export function resetToMainRoute (navigation) {
  return resetToAppRoute(navigation, MAIN_ROUTE_NAME)
}

export function isInvitationLink (path) {
  const { pathname } = url.parse(path)
  const { invitation, accessLink } = routeMatchers
  return !!(invitation(pathname) || accessLink(pathname))
}

const route = pathMatch()

export const routeMatchers = {
  invitation: route('/h/use-invitation'),
  accessLink: route('/c/:slug/join/:accessCode'),
  passwordResetTokenLogin: route('/noo/login/token'),
  post: route('/c/:slug/p/:id'),
  networkPost: route('/n/:slug/p/:id'),
  allCommunitiesPost: route('/all/p/:id'),
  thread: route('/t/:id'),
  allCommunities: route('/all'),
  membersIndex: route('/c/:communityName/members'),
  showTopic: route('/c/:communityName/:topicName'),
  showMember: route('/m/:memberId'),
  showCommunity: route('/c/:communitySlug'),
  showNetwork: route('/n/:networkSlug')
}

export function redirectAfterLogin ({ currentUser, navigation, action }) {
  if (get('settings.signupInProgress', currentUser)) {
    resetToAppRoute(navigation, 'SignupFlow1')
  } else if (action) {
    navigation.dispatch(action)
  } else {
    resetToMainRoute(navigation)
  }
}

export function getPathFromURL (URL) {
  let nextPath = get('pathname', url.parse(URL))
  if (nextPath && nextPath[0] === '/') nextPath = nextPath.slice(1)
  return nextPath
}
