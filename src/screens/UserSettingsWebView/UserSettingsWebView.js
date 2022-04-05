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
      onNavigationStateChange={({ url }) => {
        if (url.match(/\/login/)) {
          dispatch(logout()).then(() => RNRestart.Restart())
          return false
        }
        if (!url.match(/\/settings/)) {
          webViewRef.current?.goBack()
          return false
        }
      }}
    />
  )
}
