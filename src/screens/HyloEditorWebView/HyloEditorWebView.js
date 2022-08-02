import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { WebViewMessageTypes } from 'hylo-shared'
import HyloWebView, { sendMessageFromWebView, parseWebViewMessage } from 'screens/HyloWebView'

// const onWebViewMessage = (event: WebViewMessageEvent) => {
//   this.setState({webViewHeight: Number(event.nativeEvent.data)})
// }

export const HyloEditorWebView = React.forwardRef(function HyloEditorWebView ({
  contentHTML: providedContentHTML,
  placeholder,
  readOnly,
  // groupIds,
  hideMenu,
  onChange,
  onAddTopic,
  onEnter,
  style
}, ref) {
  const webViewRef = useRef()
  const [path, setPath] = useState('hyloApp/editor')
  const [loaded, setLoaded] = useState()
  const [height, setHeight] = useState(200)
  const [contentHTML, setContentHTML] = useState(providedContentHTML)

  useImperativeHandle(ref, () => ({
    clearContent: () => {
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.CLEAR_CONTENT
      )
    }
  }))

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.EDITOR.LOADED: {
        setLoaded(true)
        break
      }

      case WebViewMessageTypes.EDITOR.ON_CHANGE: {
        setContentHTML(data)
        onChange && onChange(data)
        break
      }

      case WebViewMessageTypes.EDITOR.ON_ADD_TOPIC: {
        onAddTopic && onAddTopic(data)
        break
      }

      case WebViewMessageTypes.EDITOR.ON_ENTER: {
        onEnter && onEnter(contentHTML)
        break
      }

      // Some steps towards auto height... Probably will switch to WebShell.
      // injectedJavaScript='setTimeout(window.ReactNativeWebView.postMessage(JSON.stringify({ type: "SET_HEIGHT", data: document.body.scrollHeight })), 1000)'
      // case 'SET_HEIGHT': {
      //   console.log('!!!! SET_HEIGHT', data)
      //   setHeight(data)
      //   break
      // }
    }
  }

  useEffect(() => {
    if (loaded) {
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.SET_PROPS, {
          content: providedContentHTML
        }
      )
    }
  }, [loaded, providedContentHTML])

  useEffect(() => {
    if (loaded) {
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.SET_PROPS, {
          readOnly,
          hideMenu,
          placeholder
          // groupIds
        }
      )
    }
  }, [loaded, readOnly, hideMenu, placeholder])

  return (
    <HyloWebView
      path={path}
      onMessage={handleMessage}
      startInLoadingState
      style={{ height, ...style }}
      ref={webViewRef}
    />
  )
})

export default HyloEditorWebView
