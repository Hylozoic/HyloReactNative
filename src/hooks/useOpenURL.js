import { Linking } from 'react-native'
import { getActionFromState, CommonActions, useNavigation } from '@react-navigation/native'
import { prefixes, DEFAULT_APP_HOST } from 'navigation/linking'
import getStateFromPath from 'navigation/linking/getStateFromPath'
import { URL } from 'react-native-url-polyfill'
import { navigationRef } from 'navigation/linking/helpers'

export function useOpenURL () {
  const navigation = useNavigation()

  return (pathOrURL, reset) => openURL(pathOrURL, reset, navigation)
}

export async function openURL (providedPathOrURL, reset, navigation = navigationRef) {
  const linkingURL = new URL(providedPathOrURL, DEFAULT_APP_HOST)

  if (prefixes.includes(linkingURL.origin)) {
    const linkingPath = linkingURL.pathname + linkingURL.search
    const stateForPath = getStateFromPath(linkingPath)

    if (stateForPath) {
      const actionForPath = getActionFromState(stateForPath)

      if (reset) {
        return navigationRef.dispatch(
          CommonActions.reset({
            routes: [actionForPath.payload]
          })
        )
      }

      return navigation.dispatch(actionForPath)
    } else {
      return null
    }
  } else if (await Linking.canOpenURL(linkingURL)) {
    return Linking.openURL(linkingURL)
  }
}
