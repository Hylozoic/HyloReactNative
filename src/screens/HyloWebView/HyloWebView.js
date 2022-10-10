import React, { useCallback, forwardRef, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import Loading from 'components/Loading'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { getSessionCookie } from 'util/session'

const HyloWebView = forwardRef(function HyloWebView ({
  path: pathProp,
  route,
  onShouldStartLoadWithRequest = () => true,
  ...forwardedProps
}, webViewRef) {
  const [cookie, setCookie] = useState()
  const [uri, setUri] = useState()

  useEffect(() => {
    const path = pathProp || route?.params?.path
    setUri(`${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=hyloApp`)
  }, [pathProp, route?.params?.path])

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
      geolocationEnabled
      sharedCookiesEnabled
      // onSizeUpdated={test => console.log('!!! onContentSizeChange', test)}
      // Note: See docs for `AutoHeightWebView`. Their recommendation:
      //       `import { Dimensions } from 'react-native'`
      //
      //       `style={{ width: Dimensions.get('window').width - 15, marginTop: 35 }}`
      //
      //        This is what seemed necessary in `HyloEditorWebView`:
      //
      //        `style ={{ width: Dimensions.get('window').width - 35 }}`
      //
      //        * Don't forget to merge any styles provided in `forwardedProps.style`
      //
      {...forwardedProps}
    />
  )
})

export default HyloWebView
