import React, { useEffect, useRef, useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import logout from 'store/actions/logout'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import { navigateToLinkingPathPlain } from 'navigation/linking/custom'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import RNRestart from 'react-native-restart'

export default function HyloWebView ({ path: pathProp, route }) {
  const dispatch = useDispatch()
  const [cookie, setCookie] = useState()
  const webViewRef = useRef(null)

  const path = pathProp || route?.params?.path

  useEffect(() => {
    const getCookieAsync = async () => {
      const cookie = await getSessionCookie()
      setCookie(cookie)
    }
    getCookieAsync()
  }, [])

  if (!cookie) return <Loading />

  const uri = `${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=mobileSettings`
  
  return (
    <KeyboardFriendlyView style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        injectedJavaScript={historyAPIShim}
        source={{
          uri,
          headers: { Cookie: cookie }
        }}
        geolocationEnabled
        sharedCookiesEnabled
        onShouldStartLoadWithRequest={({ url }) => {
          // TODO: Is this the things forcing reloads when Map was in StackNavigator vs Tab?
          if (url === uri) return true
          // Restarts app if webview forwards to login page
          if (url.match(/\/login/)) {         
            dispatch(logout()).then(() => RNRestart.Restart())
            return false
          }
          // TODO: Not sure I really want to be doing this still.
          if (url.slice(0,4) === 'http') {
            Linking.openURL(url)
            return false
          }
          return true
        }}

        onNavigationStateChange={({ url }) => {
          // TODO: Probably want to inject all of the below as logic in
          //       a callback from consuming component
          if (url.match(/post/)) {
            // NOTE: This works, but due to custom linking setup resetting
            // to default state will unload map:
            // Linking.openURL('hyloapp://groups/all')
            navigateToLinkingPathPlain(url)
            webViewRef.current?.goBack()
            // webViewRef.current?.stopLoading()
            return false
          }
          // TODO: Not sure this is needed or working -- also,
          //       maybe this regex is what I meant:
          //   if (!url.match(/\/groups[^\/+$\/]settings/)) {
          if (!url.match(/\/groups\/([^\/]+)settings/)) {
            // webViewRef.stopLoading() // doesn't work
            webViewRef.current?.goBack()
            // Could force navigate to the targeted thing (group detail modal, etc)
            // navigation.navigate('Notifications - Modal')
            return false
          }
        }}
      />
    </KeyboardFriendlyView>
  )
}

// https://github.com/react-native-webview/react-native-webview/issues/1197#issuecomment-644123824
const historyAPIShim = `
(function() {
    function wrap(fn) {
      return function wrapper() {
        var res = fn.apply(this, arguments);
        window.ReactNativeWebView.postMessage(
          '{"method": "historyChange"}'
        );
        return res;
      };
    }
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener("popstate", function() {
      window.ReactNativeWebView.postMessage(
        '{"method": "historyChange"}'
      );
    });
  })();
`

// onMessage={event => {
//   const url = event.nativeEvent.url
//   if (url.match(/post/)) {
//     console.log('!!!! event', url)
//     navigateToLinkingPathPlain(url, navigation)
//   }
// }}
// originWhitelist={[ process.env.HYLO_WEB_BASE_URL, 'hyloapp://*' ]}
