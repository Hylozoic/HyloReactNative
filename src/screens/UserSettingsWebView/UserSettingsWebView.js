import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
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
          dispatch(logout())
        }
        if (!url.match(/\/settings/)) {
          webViewRef.current?.goBack()
        }
      }}
    />
  )
}
