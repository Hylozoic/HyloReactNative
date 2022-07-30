import React, { useState, useRef, useEffect } from 'react'
// import { useFocusEffect } from '@react-navigation/core'
import { HyloApp } from 'hylo-shared'
import HyloWebView from 'screens/HyloWebView'

export default function HyloEditorWebView ({
  contentHTML: providedContentHTML = '<p>test</p>',
  placeholder,
  onChange,
  onEnter
}) {
  const webViewRef = useRef(null)
  // TODO: Pass along `placeholder`, `readOnly`, and `hideMenu` to the querystring
  const [path, setPath] = useState('hyloApp/editor')
  const [contentHTML, setContentHTML] = useState(providedContentHTML)
  // TODO: Pass these back to editor for mention and topic suggestion filtering
  // const myGroups = useSelector(getMyGroups)
  // const myGroupIds = myGroups?.map(g => g.id)

  const handleMessage = message => {
    const { type, data } = HyloApp.parseWebViewMessage(message)

    switch (type) {
      case HyloApp.EDITOR.onChange: {
        setContentHTML(data)

        console.log('!!! onChange:', data)
        onChange && onChange(data)

        break
      }

      case HyloApp.EDITOR.onAddTopic: {
        const topic = data

        console.log('!!! onAddTopic:', topic)

        break
      }

      case 'onEnter': {
        console.log('!!! onEnter:', data)
        onEnter && onEnter(contentHTML)

        break
      }
    }
  }

  useEffect(() => {
    // HyloApp.sendMessageFromWebView(webViewRef, 'setContent', providedContentHTML)
  }, [contentHTML])

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
