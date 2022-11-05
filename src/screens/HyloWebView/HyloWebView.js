import React, { useCallback, forwardRef, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import Loading from 'components/Loading'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { WebViewMessageTypes } from 'hylo-shared'
import { getSessionCookie } from 'util/session'
import { match, pathToRegexp } from 'path-to-regexp'
import { parseWebViewMessage } from '.'

const HyloWebView = forwardRef(function HyloWebView ({
  allowedWebRoutes = [],
  onMessage: providedOnMessage,
  nativeRouteHandler,
  path: pathProp,
  route,
  style,
  source,
  ...forwardedProps
}, webViewRef) {
  const [cookie, setCookie] = useState()
  const [uri, setUri] = useState()

  useEffect(() => {
    const path = pathProp || route?.params?.path
    setUri(source?.uri || `${process.env.HYLO_WEB_BASE_URL}${path || ''}`)
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

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.NAVIGATION: {
        if (nativeRouteHandler) {
          const { pathname, search } = data
          const nativeRouteHandlers = nativeRouteHandler({ pathname, search })

          for (const pathMatcher in nativeRouteHandlers) {
            const matched = match(pathMatcher)(pathname)

            if (matched) {
              nativeRouteHandlers[pathMatcher]({ routeParams: matched.params, pathname, search })
              break
            }
          }
        }
      }
    }

    providedOnMessage && providedOnMessage(message)
  }

  if (!cookie) return <Loading />

  return (
    <AutoHeightWebView
      customScript={`
        window.HyloWebView = true;

        ${allowedWebRoutesJavascriptCreator(pathProp)(allowedWebRoutes)}
      `}
      geolocationEnabled
      onMessage={handleMessage}
      nestedScrollEnabled
      hideKeyboardAccessoryView
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
      // Recommended setting from AutoHeightWebView docs, with disclaimer about a
      // potential Android issue. It helpfully disables iOS zoom feature.
      viewportContent='width=device-width, user-scalable=no'
      {...forwardedProps}
    />
  )
})

export default HyloWebView

const allowedWebRoutesJavascriptCreator = loadedPath => allowRoutesParam => {
  const allowedWebRoutes = [loadedPath, ...allowRoutesParam]
  const allowedWebRoutesRegExps = allowedWebRoutes.map(allowedRoute => pathToRegexp(allowedRoute))
  const allowedWebRoutesRegExpsLiteralString = JSON.parse(JSON.stringify(allowedWebRoutesRegExps.map(a => a.toString())))

  return `
    if (window.ReactNativeWebView.reactRouterHistory) {
      window.ReactNativeWebView.reactRouterHistory.block(({ pathname, search }) => {
        const allowedWebRoutesRegExps = [${allowedWebRoutesRegExpsLiteralString}]
        const allowedRoute = allowedWebRoutesRegExps.some(allowedRoutePathRegExp => {
          return allowedRoutePathRegExp.test(pathname)
        })

        if (allowedRoute) return true

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: '${WebViewMessageTypes.NAVIGATION}',
          data: { pathname, search }
        }))

        return false
      })
    }
  `
}
