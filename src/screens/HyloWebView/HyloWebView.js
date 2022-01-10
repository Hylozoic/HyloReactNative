import React, { useEffect, forwardRef, useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch } from 'react-redux'
import logout from 'store/actions/logout'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import RNRestart from 'react-native-restart'

const HyloWebView = forwardRef(({ path: pathProp, onNavigationStateChange = () => {}, route }, webViewRef) => {
  const dispatch = useDispatch()
  const [cookie, setCookie] = useState()
  const path = pathProp || route?.params?.path
  const uri = `${process.env.HYLO_WEB_BASE_URL}${path ? `/${path}` : ''}?layoutFlags=mobileSettings`

  useEffect(() => {
    const getCookieAsync = async () => {
      const cookie = await getSessionCookie()
      setCookie(cookie)
    }
    getCookieAsync()
  }, [])

  if (!cookie) return <Loading />
  
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
          // TODO: Is this the thing forcing reloads when Map was in StackNavigator vs Tab?
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
        onNavigationStateChange={onNavigationStateChange}
      />
    </KeyboardFriendlyView>
  )
})

export default HyloWebView

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
