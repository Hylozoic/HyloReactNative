import React, { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { RenderHTMLConfigProvider, RenderHTMLSource } from 'react-native-render-html'
import WebView from 'react-native-webview'
import iframe, { iframeModel } from '@native-html/iframe-plugin'
import { useSelector } from 'react-redux'
import { PathHelpers } from 'hylo-shared'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { openURL, navigateToLinkingPath } from 'navigation/linking'

const wrapInHTMLDoc = source => {
  return `
    <html>
    <head>
      <meta charset="utf-8">
      <base href="https://hylo.com">
    </head>
    <body>
      ${source}
    </body>
    </html>
  `
}

const htmlConfig = {
  customHTMLElementModels: {
    iframe: iframeModel
  },
  WebView
}

const defaultTextProps = {
  selectable: true
}

const SpanRenderer = ({ TDefaultRenderer, ...props }) => {
  const currentlySelectedGroup = useSelector(getCurrentGroup)
  const currentGroupSlug = currentlySelectedGroup?.slug

  const handlePress = () => {
    const textNode = props.tnode

    if (textNode.hasClass('mention')) {
      return navigateToLinkingPath(PathHelpers.mentionPath(textNode.attributes['data-id'], currentGroupSlug))
    }
    if (textNode.hasClass('topic')) {
      return navigateToLinkingPath(PathHelpers.topicPath(textNode.attributes['data-id'], currentGroupSlug))
    }
  }

  return (
    <TDefaultRenderer {...props} onPress={handlePress} />
  )
}

// Collapse `p` bottom margins when they are a child of a `li`
// Not possible using `react-native-render-html` due to lack of CSS Selectors
// Watch this feature request for updates on that: https://bit.ly/3MrQYZq
const CustomPRenderer = ({ TDefaultRenderer, ...props }) => {
  const fixMarginInListStyle = props?.tnode?.parent?.tagName === 'li'
    ? { marginBottom: 5 }
    : null

  return (
    <TDefaultRenderer {...props} style={{ ...props.style, ...fixMarginInListStyle }} />
  )
}

const renderers = {
  iframe,
  span: SpanRenderer,
  p: CustomPRenderer
}

export function HlyoHTMLConfigProvider ({ children }) {
  const currentlySelectedGroup = useSelector(getCurrentGroup)

  const handleLinkPress = useCallback(
    async (_, href) => openURL(href, { groupSlug: currentlySelectedGroup?.slug }),
    [currentlySelectedGroup?.slug]
  )

  const renderersProps = {
    a: { onPress: handleLinkPress },
    iframe: { scalesPageToFit: true }
  }

  return (
    <RenderHTMLConfigProvider
      defaultTextProps={defaultTextProps}
      renderers={renderers}
      renderersProps={renderersProps}
      {...htmlConfig}
    >
      {children}
    </RenderHTMLConfigProvider>
  )
}

const HyloHTML = React.memo(
  function ({ html }) {
    const { width: contentWidth } = useWindowDimensions()

    return (
      <RenderHTMLSource
        source={{ html: wrapInHTMLDoc(html) }}
        contentWidth={contentWidth}
      />
    )
  }
)

export default HyloHTML
