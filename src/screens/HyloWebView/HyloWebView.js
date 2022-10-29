import React, { useCallback, forwardRef, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import Loading from 'components/Loading'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { getSessionCookie } from 'util/session'

const HyloWebView = forwardRef(function HyloWebView ({
  path: pathProp,
  route,
  onShouldStartLoadWithRequest = () => true,
  style,
  source,
  ...forwardedProps
}, webViewRef) {
  const [cookie, setCookie] = useState()
  const [uri, setUri] = useState()

  useEffect(() => {
    const path = pathProp || route?.params?.path
    setUri(source?.uri || `${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}`)
  }, [source?.uri, pathProp, route?.params?.path])

  useFocusEffect(
    useCallback(() => {
      const getCookieAsync = async () => {
        const newCookie = await getSessionCookie()
        setCookie(newCookie)
      }
      getCookieAsync()
    }, [])
  )

  if (!cookie) return <Loading />

  return (
    <AutoHeightWebView
      customScript='window.HyloWebView = true;'
      geolocationEnabled
      nestedScrollEnabled
      /*

      // NOTE: The following is deprecated in favor of listening for the WebView
      // post message type `WebViewMessageTypes.NAVIGATION` in combination with
      // overriding HyloWeb navigation events in HyloWeb when `window.ReactNativeWebView`
      // is true.

      onShouldStartLoadWithRequest={params => {
        const { url } = params

        // Opens full URLs in external browser if not the
        // initial URI specified on load of the WebView
        if (url === uri) return true
        if (url !== uri && url.slice(0, 4) === 'http') {
          Linking.openURL(url)
          return false
        }

        return onShouldStartLoadWithRequest(params)
      }}

      */
      ref={webViewRef}
      scalesPageToFit={false}
      // Needs to remain false for AutoHeight
      scrollEnabled={false}
      setSupportMultipleWindows={false}
      sharedCookiesEnabled
      source={{
        uri,
        headers: { cookie }
      }}
      style={[style, {
        // Avoids a known issue which can cause Android crashes
        // ref. https://github.com/iou90/react-native-autoheight-webview/issues/191
        opacity: 0.99,
        minHeight: 1
      }]}
      // Recommended setting from AutoHeightWebView docs, but didn't work for us:
      // viewportContent='width=device-width, user-scalable=no'
      {...forwardedProps}
    />
  )
})

export default HyloWebView
