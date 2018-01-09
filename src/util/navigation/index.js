/**
 * @providesModule util/navigation
 */

import { NavigationActions } from 'react-navigation'
import url from 'url'
import pathMatch from 'path-match'
import { get } from 'lodash/fp'

export function resetToRoute (navigation, routeName) {
  return navigation.dispatch(NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName})]
  }))
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
  passwordResetTokenLogin: route('/noo/login/token'),
  post: route('/c/:slug/p/:id'),
  thread: route('/t/:id')
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
