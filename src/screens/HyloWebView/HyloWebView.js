import React, { useCallback, forwardRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { Linking } from 'react-native'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'

const HyloWebView = forwardRef(({
  path: pathProp,
  onNavigationStateChange = () => {},
  onMessage = () => {},
  onShouldStartLoadWithRequest = () => true,
  route
}, webViewRef) => {
  const [cookie, setCookie] = useState()

  // TODO: Decide whether to use state for this or not...
  // const [uri, setUri] = useState()
  // useFocusEffect(
  //   useCallback(() => {
  //     const path = pathProp || route?.params?.path
  //     setUri(`${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=mobileSettings`)
  //   }, [pathProp, route?.params?.path])
  // )

  const path = pathProp || route?.params?.path
  const uri = `${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=mobileSettings`

  useFocusEffect(
    useCallback(() => {
      const getCookieAsync = async () => {
        const cookie = await getSessionCookie()
        setCookie(cookie)
      }
      getCookieAsync()
    }, [])
  )

  if (!cookie) return <Loading />
  
  return (
    <KeyboardFriendlyView style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri,
          headers: { Cookie: cookie }
        }}
        geolocationEnabled
        sharedCookiesEnabled
        onShouldStartLoadWithRequest={params => {
          // Opens full URLs in external browser if not the
          // initial URI specified on load of the WebView
          const { url } = params
          if (url !== uri && url.slice(0,4) === 'http') {
            Linking.openURL(url)
            return false
          }
          return onShouldStartLoadWithRequest(params)
        }}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
      />
    </KeyboardFriendlyView>
  )
})

export default HyloWebView
