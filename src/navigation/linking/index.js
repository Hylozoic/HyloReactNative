import { modalScreenName } from 'hooks/useIsModalScreen'

/*

Hylo Custom link routing config and related utilities:

The current version of `react-navigation` doesn't have a way to map multiple paths
to the same screen. The below way of mapping screens to paths is being used to
construct and, otherwise in alternate to, `linking.config.screens`.

See: `navigation/linking/getStateFromPath.js` here, and https://reactnavigation.org/docs/configuring-links

All routes are always available, but routes that begin with `AUTH_ROOT_SCREEN_NAME`
will be set as the `returnToPath` and not navigated to until after
the user is authorized (see `getAuthState`).

NOTE: The linking route paths below are equivalent to `exact` route paths in
React Router (web)

*/

export const AUTH_ROOT_SCREEN_NAME = 'AuthRoot'
export const NON_AUTH_ROOT_SCREEN_NAME = 'NonAuthRoot'

/* eslint-disable key-spacing */
export const routingConfig = {
  '/login':                                                  `${NON_AUTH_ROOT_SCREEN_NAME}/Login`,
  '/signup/:step(verify-email)':                             `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/SignupEmailValidation`,
  '/signup/:step?':                                          `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/Signup Intro`,
  '/signup':                                                 `${NON_AUTH_ROOT_SCREEN_NAME}/Signup/Signup Intro`,
  '/noo/login/(jwt|token)':                                  'LoginByTokenHandler',
  '/h/use-invitation':                                       'JoinGroup',
  '/:context(groups)/:groupSlug/join/:accessCode':           'JoinGroup',

  '/hylo-editor':                                            `${AUTH_ROOT_SCREEN_NAME}/HyloEditor`,

  // context group routes (/all, /public)
  '/:groupSlug(all|public)':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab`,
  '/:groupSlug(all|public)/post/:id':                        `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:groupSlug(all)/members/:id':                            `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Member`,
  '/:groupSlug(all)/topics/:topicName':                      `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,

  // map routes
  '/:groupSlug(all|public)/map':                             `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Map`,
  '/:context(groups)/:groupSlug/map':                        `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Map`,
  '/:context(groups)/:groupSlug/map/create':                 `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  // /groups
  '/:context(groups)/:groupSlug/settings/invite':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Invite`,
  '/:context(groups)/:groupSlug/settings/requests':          `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Join Requests`,
  '/:context(groups)/:groupSlug/settings/relationships':     `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Related Groups`,
  '/:context(groups)/:groupSlug/settings/export':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Export Data`,
  '/:context(groups)/:groupSlug/settings/delete':            `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Delete`,
  '/:context(groups)/:groupSlug/settings':                   `${AUTH_ROOT_SCREEN_NAME}/Group Settings/Settings`,
  '/:context(groups)/:groupSlug/groups':                     `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Group Relationships`,
  '/:context(groups)/:groupSlug/topics/:topicName':          `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,
  '/:context(groups)/:groupSlug/members/:id':                `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Member`,
  '/:context(groups)/:groupSlug/members':                    `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Members`,
  '/:context(groups)/:groupSlug':                            `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`,
  '/:context(groups)/:groupSlug/post/:id':                   `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Post Details`,
  '/:context(groups)/:groupSlug/post/:id/edit':              `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  // /settings
  '/settings':                                               `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Edit Profile`,
  '/settings/account':                                       `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Account`,
  '/settings/notifications':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Notifications`,
  '/settings/blocked-users':                                 `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Blocked Users`,
  '/settings/:section?':                                     `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Settings Tab/Edit Profile`,

  // /messages
  '/messages/new':                                           `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/New Message`,
  '/messages/:id':                                           `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/Thread`,
  '/messages':                                               `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Messages Tab/Messages`,

  // catch-alls
  '(.*)/group/:groupSlug':                                   `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Group Explore')}`,
  '(.*)/members/:id':                                        `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Member')}`,
  '(.*)/post/:id':                                           `${AUTH_ROOT_SCREEN_NAME}/${modalScreenName('Post Details')}`,
  '(.*)/create/group':                                       `${AUTH_ROOT_SCREEN_NAME}/Create Group`,
  '(.*)/create/post':                                        `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,
  '(.*)/post/:id/edit':                                      `${AUTH_ROOT_SCREEN_NAME}/Edit Post`,

  '/':                                                       `${AUTH_ROOT_SCREEN_NAME}/Drawer/Tabs/Home Tab/Feed`
}

// These screens will always be present and be first for the key'd navigator
export const initialRouteNamesConfig = {
  [AUTH_ROOT_SCREEN_NAME]: 'Drawer',
  'Home Tab': 'Group Navigation',
  'Messages Tab': 'Messages'
}

export const DEFAULT_APP_HOST = 'https://hylo.com'

export const prefixes = [
  DEFAULT_APP_HOST,
  'http://hylo.com',
  'http://www.hylo.com',
  'https://www.hylo.com',
  'http://staging.hylo.com',
  'https://staging.hylo.com',
  'hyloapp://'
]
