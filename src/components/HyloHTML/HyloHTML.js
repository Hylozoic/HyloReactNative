import React from 'react'
import { useWindowDimensions } from 'react-native'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import WebView from 'react-native-webview'
import iframe, { iframeModel } from '@native-html/iframe-plugin'
import { useSelector } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { openURL, navigateToLinkingPath } from 'navigation/linking'
import { PathHelpers } from 'hylo-shared'
import { nevada, rhino, white80 } from 'style/colors'

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
const systemFonts = [...defaultSystemFonts, 'Circular-Book']
const baseStyle = {
  color: nevada,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Circular-Book'
}
const tagsStyles = {
  iframe: {
    alignSelf: 'center'
  },
  a: {
    color: '#0275d8',
    textDecorationLine: 'none'
  },
  code: {
    color: white80,
    backgroundColor: rhino,
    fontSize: 12,
    padding: 10
  },
  pre: {
    borderRadius: '0.5em',
    display: 'block',
    overflow: 'scroll',
    fontSize: 12,
    padding: 1.25
  }
}
const classesStyles = {
  'hylo-link': {
    color: '#0DC39F'
  },
  mention: {
    color: '#0DC39F',
    textDecorationLine: 'none'
  },
  topic: {
    color: '#0DC39F',
    textDecorationLine: 'none'
  }
}

const HyloHTML = React.memo(
  function ({
    html,
    baseStyle: providedBaseStyle = {},
    tagsStyles: providedTagsStyles = {},
    classesStyles: providedClassessStyles = {}
  }) {
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
      <RenderHTML
        source={{ html: wrapInHTMLDoc(html) }}
        renderers={renderers}
        renderersProps={renderersProps}
        defaultTextProps={defaultTextProps}
        baseStyle={{ ...baseStyle, ...providedBaseStyle }}
        tagsStyles={{ ...tagsStyles, ...providedTagsStyles }}
        classesStyles={{ ...classesStyles, ...providedClassessStyles }}
        contentWidth={contentWidth}
        systemFonts={systemFonts}
        {...htmlConfig}
      />
    )
  }
)

export default HyloHTML
