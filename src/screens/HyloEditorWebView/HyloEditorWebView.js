import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Dimensions } from 'react-native'
import { WebViewMessageTypes } from 'hylo-shared'
import HyloWebView, { sendMessageFromWebView, parseWebViewMessage } from 'screens/HyloWebView'

const DEFAULT_WIDTH_OFFSET_IOS = 15
const DEFAULT_HEIGHT_OFFSET_IOS = 15

export function HyloEditorWebView ({
  contentHTML: providedContentHTML,
  placeholder,
  readOnly,
  groupIds,
  showMenu,
  onChange,
  onAddTopic,
  onAddLink,
  onEnter,
  style,
  containerStyle,
  customStyle,
  widthOffset = 0
}, ref) {
  const webViewRef = useRef()
  // const [path] = useState('hyloApp/editor?suppressEnterKeyPropagation=true')
  const [path] = useState('hyloApp/editor')
  const [isEmpty, setIsEmpty] = useState()
  const [contentHTML, setContentHTML] = useState()
  const [loaded, setLoaded] = useState()

  useImperativeHandle(ref, () => ({
    blur: () => {
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.BLUR
      )
    },
    clearContent: () => {
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.CLEAR_CONTENT
      )
    },
    focus: () => {
      webViewRef.current.requestFocus()
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.FOCUS
      )
    },
    getHTML: () => {
      return contentHTML
    },
    isEmpty
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
        setIsEmpty(!data || data.trim() === '<p></p>' || data.trim() === '<p> </p>')
        onChange && onChange(data)
        break
      }

      case WebViewMessageTypes.EDITOR.ON_ADD_LINK: {
        onAddLink && onAddLink(data)
        break
      }

      case WebViewMessageTypes.EDITOR.ON_ADD_TOPIC: {
        onAddTopic && onAddTopic(data)
        break
      }

      case WebViewMessageTypes.EDITOR.ON_ENTER: {
        onEnter && onEnter(data)
        break
      }
    }
  }

  useEffect(() => {
    if (loaded) {
      sendMessageFromWebView(
        webViewRef,
        WebViewMessageTypes.EDITOR.SET_PROPS, {
          readOnly,
          showMenu,
          placeholder,
          groupIds
        }
      )
    }
  }, [loaded, readOnly, showMenu, placeholder, groupIds])

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

  return React.createElement(HyloWebView, {
    path,
    onMessage: handleMessage,
    startInLoadingState: false,
    customStyle,
    //  || `
    //   .hyloEditorMobileContainer {
    //     padding: 8px;
    //     height: auto;
    //     overflow-y: auto;
    //   }
    //   .ProseMirror p.is-editor-empty:first-child::after {
    //     margin-bottom: 0px;
    //   }
    //   .hyloEditorMobileContainer .hyloEditorMobile .ProseMirror {
    //     height: auto;
    //     max-height: 200px;
    //   }
    // `,
    // Related to getting auto-height right and scrolling:
    scrollEnabled: false,
    nestedScrollEnabled: true,
    scalesPageToFit: false,
    // Seems to help but when it's relied upon (e.g. PostEditor height)
    // it causes 2 resizes and could probably be handled better otherwise
    automaticallyAdjustContentInsets: true,
    style: [style, {
      // If Android crashes, apply this fix (ref. https://github.com/iou90/react-native-autoheight-webview/issues/191)
      // opacity: 0.99, minHeight: 1
      width: Dimensions.get('window').width - DEFAULT_WIDTH_OFFSET_IOS - widthOffset
    }],
    containerStyle,
    ref: webViewRef,
    showsVerticalScrollIndicator: true,
    hideKeyboardAccessoryView: true
  })
}

export default React.forwardRef(HyloEditorWebView)
