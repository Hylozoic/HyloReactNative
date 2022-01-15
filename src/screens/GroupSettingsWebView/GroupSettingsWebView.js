import React, { useRef } from 'react'
import HyloWebView from 'screens/HyloWebView'

export default function GroupSettingsWebView ({ path: pathProp, navigation, route }) {
  const webViewRef = useRef(null)
  const path = pathProp || route?.params?.path

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onNavigationStateChange={({ url }) => {
        if (!url.match(/\/groups\/([^\/]+)settings/)) {
          webViewRef.current?.goBack()
          return false
        }
      }}
    />
  )
}
