import React, { useState, useRef, useEffect } from 'react'
import { WebViewMessageTypes } from 'hylo-shared'
import HyloWebView, { sendMessageFromWebView, parseWebViewMessage } from 'screens/HyloWebView'

export default function HyloEditorWebView ({
  contentHTML: providedContentHTML,
  placeholder,
  readOnly,
  groupIds,
  hideMenu,
  onChange,
  onAddTopic,
  onEnter,
  style
}) {
  const webViewRef = useRef()
  const [path, setPath] = useState('hyloApp/editor')
  const [loaded, setLoaded] = useState()
  const [contentHTML, setContentHTML] = useState(providedContentHTML)
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
          placeholder,
          groupIds
        }
      )
    }
  }, [loaded, readOnly, hideMenu, placeholder, groupIds])

  return (
    <HyloWebView
      path={path}
      onMessage={handleMessage}
      startInLoadingState
      style={{ height: 300, ...style }}
      ref={webViewRef}
    />
  )
}
