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
    setUri(source?.uri || `${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=hyloApp`)
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
    // Note: This used to be wrapped in a `KeyboardFriendView`. Seems to be ok or better without it.
    <AutoHeightWebView
      ref={webViewRef}
      source={{
        uri,
        headers: { cookie }
      }}
      // FOR DEBUGGING ONLY: Never leave on in a production build...
      // cacheMode='LOAD_NO_CACHE'
      geolocationEnabled
      nestedScrollEnabled
      // Probably needs to remain false for AutoHeight
      scrollEnabled={false}
      sharedCookiesEnabled
      startInLoadingState
      // eslint-disable-next-line react-native/no-inline-styles
      style={[style, {
        // Avoids a known issue which can cause Android crashes
        // ref. https://github.com/iou90/react-native-autoheight-webview/issues/191
        opacity: 0.99,
        minHeight: 1
      }]}
      // Recommended setting from AutoHeightWebView docs but doesn't work for us:
      // viewportContent='width=device-width, user-scalable=no'
      {...forwardedProps}
    />
  )
})

export default HyloWebView
