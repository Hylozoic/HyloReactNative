import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import RNRestart from 'react-native-restart'
import logout from 'store/actions/logout'
import HyloWebView from 'screens/HyloWebView'

export default function UserSettingsWebView ({ path: pathProp, navigation, route }) {
  const dispatch = useDispatch()
  const webViewRef = useRef(null)
  const path = pathProp || route?.params?.path

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onShouldStartLoadWithRequest={({ url }) => {
        // Restarts app if webview forwards to login page
        if (url.match(/\/login/)) {
          dispatch(logout()).then(() => RNRestart.Restart())
          return false
        }
        return true
      }}
      onNavigationStateChange={({ url }) => {
        if (!url.match(/\/settings/)) {
          webViewRef.current?.goBack()
          // Could force navigate to the targeted thing (group detail modal, etc)
          // navigation.navigate('Notifications - Modal')
          return false
        }
      }}
    />
  )
}
