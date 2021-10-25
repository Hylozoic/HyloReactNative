import React, { useEffect, useRef, useState } from 'react'
import { Linking } from 'react-native'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'

export default function HyloWebView ({ path: pathProp, route }) {
  const [cookie, setCookie] = useState()
  const webViewRef = useRef(null)

  const path = pathProp || route?.params?.path

  useEffect(() => {
    const asyncFunc = async () => {
      const cookie = await getSessionCookie()
      setCookie(cookie)
    }

    asyncFunc()
  }, [])

  if (!cookie) return <Loading />

  // const onNavigationStateChange = newNavState => {
  //   const { url } = newNavState
  
  //   if (!url) return false

  //   if (url.includes('/groups/')) {
  //     const groupSlug = url.split('/').slice(-1)[0]
  //     console.log('!! navigate in WebView to -- url, groupSlug:', url, groupSlug, webViewRef.current)
  //     // Should blick the WebView from navigating
  //     // but it doesn't seem to do that currently
  //     webViewRef.current.stopLoading()
  //     return false
  //   }
  // }

  const uri = `${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=mobileSettings`

  return (
    <KeyboardFriendlyView style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri,
          headers: { Cookie: cookie }
        }}
        sharedCookiesEnabled={true}
        onShouldStartLoadWithRequest={event => {
          if (event.url === uri) return true
          if (event.url.slice(0,4) === 'http') {
              Linking.openURL(event.url)
              return false
          }
          return true
        }}
        // startInLoadingState={true} 
        // onShouldStartLoadWithRequest={({ url }) => {
        //   if (!url) return false
        //   if (url.includes('/groups/')) {
        //     webViewRef.current.stopLoading()
        //     return false
        //   }

        //   return true
        // }}
        // onNavigationStateChange={onNavigationStateChange}
        style={{ marginTop: 0 }}
      />
    </KeyboardFriendlyView>
  )
}
