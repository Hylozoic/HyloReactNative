import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import logout from 'store/actions/logout'
import HyloWebView, { parseWebViewMessage } from 'screens/HyloWebView'
import { WebViewMessageTypes } from 'hylo-shared'
import { LEAVE_GROUP } from 'store/constants'

export default function UserSettingsWebView ({ path: pathProp, navigation, route }) {
  const dispatch = useDispatch()
  const webViewRef = useRef(null)
  const path = pathProp || route?.params?.path

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.LEFT_GROUP: {
        return data.groupId && dispatch({ type: LEAVE_GROUP, meta: { id: data.groupId } })
      }
    }
  }

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
      onMessage={handleMessage}
    />
  )
}
