import React from 'react'
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

const HyloHTML = React.memo(
  function ({ html }) {
    const { width: contentWidth } = useWindowDimensions()
    const { slug: currentGroupSlug } = useSelector(getCurrentGroup)

    const handleLinkPress = async (_, href) => openURL(href, { groupSlug: currentGroupSlug })

    const spanRenderer = ({ TDefaultRenderer, ...props }) => {
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

    const renderers = {
      iframe,
      span: spanRenderer
    }
    const renderersProps = {
      a: { onPress: handleLinkPress },
      iframe: { scalesPageToFit: true }
    }

    return (
      <RenderHTMLConfigProvider
        renderers={renderers}
        renderersProps={renderersProps}
        defaultTextProps={defaultTextProps}
        {...htmlConfig}
      >
        <RenderHTMLSource
          source={{ html: wrapInHTMLDoc(html) }}
          contentWidth={contentWidth}
        />
      </RenderHTMLConfigProvider>
    )
  }
)

export default HyloHTML
