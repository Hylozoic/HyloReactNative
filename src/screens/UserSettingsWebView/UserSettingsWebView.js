import React, { useRef } from 'react'
import HyloWebView from 'screens/HyloWebView'

export default function UserSettingsWebView ({ path: pathProp, navigation, route }) {
  const webViewRef = useRef(null)
  const path = pathProp || route?.params?.path

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
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
