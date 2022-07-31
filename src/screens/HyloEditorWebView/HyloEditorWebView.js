import React, { useState, useRef, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { WebViewMessageTypes } from 'hylo-shared'
import HyloWebView, { sendMessageFromWebView, parseWebViewMessage } from 'screens/HyloWebView'

export default function HyloEditorWebView ({
  contentHTML: providedContentHTML = '<p>test</p>',
  placeholder,
  onChange,
  onAddTopic,
  onEnter
}) {
  const webViewRef = useRef()
  // TODO: Pass along `placeholder`, `readOnly`, and `hideMenu` to the querystring
  const [path, setPath] = useState('hyloApp/editor')
  const [contentHTML, setContentHTML] = useState(providedContentHTML)
  // TODO: Pass these back to editor for mention and topic suggestion filtering
  // const myGroups = useSelector(getMyGroups)
  // const myGroupIds = myGroups?.map(g => g.id)

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.EDITOR.ON_CHANGE: {
        setContentHTML(data)

        onChange && onChange(data)

        break
      }

      case WebViewMessageTypes.EDITOR.ON_ADD_TOPIC: {
        console.log('!!! onAddTopic:', data)
        onAddTopic && onAddTopic(data)

        break
      }

      case WebViewMessageTypes.EDITOR.ON_ENTER: {
        onEnter && onEnter(contentHTML)

        break
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      // TODO: Wait until WebView is done loading, make editor readOnly while doing so ...
      setTimeout(() => sendMessageFromWebView(webViewRef, WebViewMessageTypes.EDITOR.SET_CONTENT, providedContentHTML), 1000)
    }, [webViewRef.current, providedContentHTML])
  )

  return (
    <HyloWebView
      path={path}
      onMessage={handleMessage}
      // onMessage={handleMessage}
      // Required for emulator with the map but may be disadventageous for actual
      // devices as this has the effect of disabling hardware acceleration.
      androidLayerType='software'
      // TODO: Sizing issue....
      style={{ height: 200, width: 300 }}
      ref={webViewRef}
    />
  )
}
