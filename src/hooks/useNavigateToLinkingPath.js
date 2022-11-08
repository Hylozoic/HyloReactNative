import { CommonActions, getActionFromState, useNavigation } from '@react-navigation/native'
import { DEFAULT_APP_HOST, getStateFromPath } from 'navigation/linking'
import { URL } from 'react-native-url-polyfill'

// This could possibly be replaced by updating the logic applied by Linking.openURL
// TODO: !!! Experiment and not currently used
export default function useNavigateToLinkingPath () {
  const navigation = useNavigation()

  return async (providedUrl, reset) => {
    const linkingURL = new URL(providedUrl, DEFAULT_APP_HOST)
    const linkingPath = linkingURL.pathname + linkingURL.search
    const stateForPath = getStateFromPath(linkingPath)

    if (stateForPath) {
      const actionForPath = getActionFromState(stateForPath)

      if (reset) {
        return navigation.dispatch(
          CommonActions.reset({
            routes: [actionForPath.payload]
          })
        )
      }
      return navigation.dispatch(actionForPath)
    } else {
      return null
    }
  }
}
