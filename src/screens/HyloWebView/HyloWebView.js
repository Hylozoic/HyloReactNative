import React, { useEffect, useRef, useState } from 'react'
import { Linking } from 'react-native'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'

export default function HyloWebView ({ path: pathProp, route, navigation }) {
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
        sharedCookiesEnabled={true}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url === uri) return true
          if (url.slice(0,4) === 'http') {
            Linking.openURL(url)
            return false
          }
          return true
        }}
        onNavigationStateChange={({ url }) => {
          if (!url.match(/\/groups\/settings/)) {
            // This is a bug, it doesn't work to stop loading
            // returning false in onShouldStartLoadWithRequest does work
            // but it doesn't capture the shimmed react router history change
            // webViewRef.stopLoading()
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
