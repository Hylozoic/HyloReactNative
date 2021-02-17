import url from 'url'
import { match } from 'path-to-regexp'
import { get } from 'lodash/fp'

export const MAIN_ROUTE_NAME = 'Main'
export const MAIN_ROUTE_PATH = 'main'

export function resetToAuthRoute (navigation, routeName) {
  // return navigation.dispatch({
  //   type: 'Navigation/NAVIGATE',
  //   routeName: 'AuthNavigator',
  //   action: {
  //     type: 'Navigation/NAVIGATE',
  //     routeName: routeName
  //   }
  // })
}

export function resetToAppRoute (navigation, routeName) {
  // return navigation.dispatch({
  //   type: 'Navigation/NAVIGATE',
  //   routeName: 'AppNavigator',
  //   action: {
  //     type: 'Navigation/NAVIGATE',
  //     routeName: routeName
  //   }
  // })
}

export function resetToMainRoute (navigation) {
  return resetToAppRoute(navigation, MAIN_ROUTE_NAME)
}

export function isInvitationLink (path) {
  const { pathname } = url.parse(path)
  const { invitation, accessLink } = routeMatchers
  return !!(invitation(pathname) || accessLink(pathname))
}

export const routeMatchers = {
  invitation: match('/h/use-invitation'),
  accessLink: match('/c/:slug/join/:accessCode'),
  passwordResetTokenLogin: match('/noo/login/token'),
  post: match('/c/:slug/p/:id'),
  allGroupsPost: match('/all/p/:id'),
  thread: match('/t/:id'),
  allGroups: match('/all'),
  membersIndex: match('/c/:groupName/members'),
  showTopic: match('/c/:groupName/:topicName'),
  showMember: match('/m/:memberId'),
  showGroup: match('/c/:groupSlug')
}

export function redirectAfterLogin ({ currentUser, navigation, action }) {
  if (currentUser?.settings?.signupInProgress) {
    navigation.navigate('Signup', { screen: 'SignupFlow1' })
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