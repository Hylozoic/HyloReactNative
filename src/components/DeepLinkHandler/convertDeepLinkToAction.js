import url from 'url'
import { routeMatchers, MAIN_ROUTE_PATH } from 'util/navigation'
import qs from 'querystring'
import RootNavigator from '../RootNavigator'

export default function convertDeepLinkToAction (path) {
  return RootNavigator.router.getActionForPathAndParams(reformatPath(path))
}

export function reformatPath (path) {
  let match
  const { query, pathname } = url.parse(path)
  const params = qs.parse(query)

  match = routeMatchers.post(pathname)
  // we have to prepend the main route's path segment because PostDetails is
  // in a nested navigator, not the top-level StackNavigator.
  if (match) return `${MAIN_ROUTE_PATH}/post/${match.id}`

  match = routeMatchers.thread(pathname)
  if (match) return 'thread/' + match.id

  match = routeMatchers.invitation(pathname)
  if (match) return `useInvitation/${params.token}`

  match = routeMatchers.accessLink(pathname)
  if (match) return `useAccessCode/${match.slug}/${match.accessCode}`

  return path
}
