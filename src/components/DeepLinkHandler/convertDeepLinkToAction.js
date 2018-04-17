import url from 'url'
import { routeMatchers, getPathFromURL, MAIN_ROUTE_PATH } from 'util/navigation'
import qs from 'querystring'
import RootNavigator from '../RootNavigator'

export default function convertDeepLinkToAction (path) {
  return RootNavigator.router.getActionForPathAndParams(reformatPath(path))
}

export function reformatPath (path) {
  let match
  let { query, pathname } = url.parse(path)

  // LEJ: For the case of already path reformatted
  // nextURLs in token auth'dlinks
  pathname = pathname[0] === '/' ? pathname : `/${pathname}`

  const params = qs.parse(query)

  match = routeMatchers.post(pathname) ||
    routeMatchers.networkPost(pathname) ||
    routeMatchers.allCommunitiesPost(pathname)
  // we have to prepend the main route's path segment because PostDetails is
  // in a nested navigator, not the top-level StackNavigator.
  if (match) return `${MAIN_ROUTE_PATH}/post/${match.id}`

  match = routeMatchers.allCommunities(pathname)
  if (match) return `${MAIN_ROUTE_PATH}/feed/all-communities`

  match = routeMatchers.thread(pathname)
  if (match) return 'thread/' + match.id

  match = routeMatchers.invitation(pathname)
  if (match) return `useInvitation/${params.token}`

  match = routeMatchers.accessLink(pathname)
  if (match) return `useAccessCode/${match.slug}/${match.accessCode}`

  match = routeMatchers.passwordResetTokenLogin(pathname)
  if (match) {
    const {u: userId, t: loginToken, n: nextURL} = params
    const nextPath = getPathFromURL(nextURL)

    return `passwordResetTokenLogin/${userId}/${encodeURIComponent(loginToken)}/${encodeURIComponent(nextPath)}`
  }

  match = routeMatchers.membersIndex(pathname)
  if (match) return `${MAIN_ROUTE_PATH}/people`

  match = routeMatchers.topicsIndex(pathname)
  if (match) return `${MAIN_ROUTE_PATH}/topics`

  match = routeMatchers.showTopic(pathname)
  if (match) console.log('showTopic')
  if (match) return `${MAIN_ROUTE_PATH}/topicFeed/${match.topicName}`

  match = routeMatchers.showMember(pathname)
  if (match) return `${MAIN_ROUTE_PATH}/people/${match.memberId}`

  match = routeMatchers.showCommunity(pathname)
  if (match) return `${MAIN_ROUTE_PATH}/communityFeed/${match.communitySlug}`

  match = routeMatchers.showNetwork(pathname)
  if (match) return `${MAIN_ROUTE_PATH}/networkFeed/${match.networkSlug}`

  return path
}
