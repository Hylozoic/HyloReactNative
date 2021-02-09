import { Linking } from 'react-native'

export default function urlHandler (url, showMember, showTopic, slug) {
  // TODO: Adapt to use React Navigation Linking setup with our custom router
  const groupRoute = slug ? `/c/${slug}/` : ''
  const variableRoute = url.substring(groupRoute.length - 1)
  const [_, prefix, suffix] = variableRoute.split('/')
  switch (prefix) {
    case 'm':
      return showMember && showMember(suffix)
    case 'tag':
      return showTopic && showTopic(suffix)
    default:
      Linking.openURL(url)
  }
}
