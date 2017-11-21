import url from 'url'
import { routeMatchers } from 'util/navigation'
import qs from 'querystring'

export default function convertEntryUrl (path, isLoggedIn) {
  let match
  const { query, pathname } = url.parse(path)
  const params = qs.parse(query)

  match = routeMatchers.post(pathname)
  if (match) return '/post/' + match.id

  match = routeMatchers.thread(pathname)
  if (match) return '/thread/' + match.id

  match = routeMatchers.invitation(pathname)
  if (match) {
    const action = isLoggedIn ? 'use' : 'check'
    return `/${action}Invitation/${params.token}`
  }

  match = routeMatchers.accessLink(pathname)
  if (match) {
    const action = isLoggedIn ? 'use' : 'check'
    return `/${action}AccessCode/${match.slug}/${match.accessCode}`
  }

  return path
}
