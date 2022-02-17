import { navigateToLinkingPathInApp } from '.'
import { openURL } from 'util'

export default function urlHandler (url, slug = 'all') {
  const { length, [length - 2]: prefix, [length - 1]: suffix } = url.split('/')
  const groupRoute = slug === 'all'
    ? '/all'
    : `/groups/${slug}`
  console.log('!!!! url', url)
  switch (prefix) {
    case 'members':
    case 'm':
    case 'u':
      return navigateToLinkingPathInApp(`${groupRoute}/members/${suffix}`)
    case 'topics':
    case 'tag':
      return navigateToLinkingPathInApp(`${groupRoute}/topics/${suffix}`)
    default:
      return openURL(url)
  }
}
