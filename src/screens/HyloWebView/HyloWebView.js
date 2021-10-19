import React, { useEffect, useRef, useState } from 'react'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'

export default function HyloWebView ({ path, navigation }) {
  const [cookie, setCookie] = useState()
  const webViewRef = useRef(null)

  useEffect(() => {
    const asyncFunc = async () => {
      const cookie = await getSessionCookie()
      setCookie(cookie)
    }

    asyncFunc()
  }, [])

  if (!cookie) return <Loading />

  const onNavigationStateChange = newNavState => {
    const { url } = newNavState
  
    if (!url) return false

    if (url.includes('/groups/')) {
      const groupSlug = url.split('/').slice(-1)[0]
      console.log('!! navigate in WebView to -- url, groupSlug:', url, groupSlug, webViewRef.current)
      // Should blick the WebView from navigating
      // but it doesn't seem to do that currently
      webViewRef.current.stopLoading()
      return false
    }
  }

  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: `https://hylo.com${path ? `/${path}` : ''}`,
        headers: { Cookie: cookie }
      }}
      sharedCookiesEnabled={true}
      onShouldStartLoadWithRequest={({ url }) => {
        if (!url) return false
        if (url.includes('/groups/')) {
          webViewRef.current.stopLoading()
          return false
        }

        return true
      }}
      // onNavigationStateChange={onNavigationStateChange}
      style={{ marginTop: 0 }}
    />
  )
}
