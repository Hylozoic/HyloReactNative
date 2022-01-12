import React, { useEffect, forwardRef, useState } from 'react'
import { Linking } from 'react-native'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'

const HyloWebView = forwardRef(({
  path: pathProp,
  onNavigationStateChange = () => {},
  onShouldStartLoadWithRequest = () => true,
  route
}, webViewRef) => {
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
        onShouldStartLoadWithRequest={params => {
          const { url } = params
          if (url === uri) return true
          // Opens full URLs in external browser
          if (url.slice(0,4) === 'http') {
            Linking.openURL(url)
            return false
          }
          onShouldStartLoadWithRequest(params)
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
