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

export function isInvitationLink (path) {
  const { pathname } = url.parse(path)
  const { invitation, accessLink } = routeMatchers
  return !!(invitation(pathname) || accessLink(pathname))
}

const route = pathMatch()

export const routeMatchers = {
  invitation: route('/h/use-invitation'),
  accessLink: route('/c/:slug/join/:accessCode'),
  post: route('/c/:slug/p/:id'),
  thread: route('/t/:id')
}

export function redirectAfterLogin ({ navigation, currentUser, deepLink }) {
  if (get('settings.signupInProgress', currentUser)) {
    resetToRoute(navigation, 'SignupFlow1')
  } else if (deepLink) {
    navigation.dispatch(deepLink)
  } else {
    resetToRoute(navigation, 'Main')
  }
}
