import { Linking } from 'react-native'

export default function urlHandler (url, showMember, showTopic, slug) {
  // TODO This is insufficient. We need a generalized link handler that catches
  // hylo links and redirects them internally
  const communityRoute = `/c/${slug}/`
  const variableRoute = url.substring(communityRoute.length)
  const [ prefix, suffix ] = variableRoute.split('/')
  switch (prefix) {
    case 'm':
      return showMember(suffix)
    case 'tag':
      return showTopic(suffix)
    default:
      Linking.openURL(url)
  }
}
