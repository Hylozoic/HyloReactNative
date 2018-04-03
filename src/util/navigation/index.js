/**
 * @providesModule util/navigation
 */

import { NavigationActions } from 'react-navigation'
import url from 'url'
import pathMatch from 'path-match'
import { get } from 'lodash/fp'

export function resetToRoute (navigation, routeName) {
  // Setting key to null to handle "There is no route defined for..." exceptions
  // on nested navigation reference
  // NOTE: "key: null" solution works in iOS but not Android, hence the try/catch
  //
  //
  // https://github.com/react-navigation/react-navigation/issues/1127
  try {
    return navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({routeName})]
    }))
  } catch (err) {
    console.log('!! failed to navigate:', err)
    return false
  }
}

export const MAIN_ROUTE_NAME = 'Main'
export const MAIN_ROUTE_PATH = 'main'

export function resetToMainRoute (navigation) {
  return resetToRoute(navigation, MAIN_ROUTE_NAME)
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
  loginToken: route('/noo/login/token'),
  post: route('/c/:slug/p/:id'),
  networkPost: route('/n/:slug/p/:id'),
  allCommunitiesPost: route('/all/p/:id'),
  thread: route('/t/:id'),
  allCommunities: route('/all'),
  membersIndex: route('/c/hylo/members'),
  topicsIndex: route('/c/hylo-community-organizing/topics'),
  showTopic: route('/c/hylo-community-organizing/:topicName'),
  showMember: route('/m/:memberId')
}

export function redirectAfterLogin ({ currentUser, navigation, action }) {
  if (get('settings.signupInProgress', currentUser)) {
    resetToRoute(navigation, 'SignupFlow1')
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
