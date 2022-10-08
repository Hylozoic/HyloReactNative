import React from 'react'
import { useWindowDimensions } from 'react-native'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import WebView from 'react-native-webview'
import iframe, { iframeModel } from '@native-html/iframe-plugin'
import { useSelector } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { openURL, navigateToLinkingPath } from 'navigation/linking'
import { PathHelpers, TextHelpers } from 'hylo-shared'
import { nevada } from 'style/colors'

const TAG_WHITELIST = TextHelpers.insaneOptions().allowedTags

const htmlConfig = {
  tagsStyles: {
    iframe: {
      alignSelf: 'center'
    }
  },
  customHTMLElementModels: {
    iframe: iframeModel
  },
  WebView
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

    const source = { html: wrapInHTMLBody(html) }
    const ignoreDomNode = (node, parentTagName, parentIsText) => {
      if (!node.name || TAG_WHITELIST.includes(node.name)) {
        return false
      }
      return true
    }
    const renderers = {
      iframe,
      span: spanRenderer
    }
    const renderersProps = {
      a: { onPress: handleLinkPress },
      iframe: { scalesPageToFit: true }
    }
    const defaultTextProps = {
      selectable: true
    }
    const baseStyle = { ...renderHTMLStyles.baseStyle, ...providedBaseStyle }
    const tagsStyles = { ...renderHTMLStyles.tagsStyles, ...providedTagsStyles }
    const classesStyles = { ...renderHTMLStyles.classesStyles, ...providedClassessStyles }
    const systemFonts = [...defaultSystemFonts, 'Circular-Book']

    return (
      <RenderHTML
        source={source}
        // ignoreDomNode={ignoreDomNode}
        renderers={renderers}
        renderersProps={renderersProps}
        defaultTextProps={defaultTextProps}
        baseStyle={baseStyle}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        contentWidth={contentWidth}
        systemFonts={systemFonts}
        {...htmlConfig}
      />
    )
  }
)

export default HyloHTML

const wrapInHTMLBody = source => {
  return `
    <html>
    <head>
      <base href="https://hylo.com">
    </head>
    <body>
      ${source}
    </body>
    </html>
  `
}

export const renderHTMLStyles = {
  baseStyle: {
    color: nevada,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Circular-Book'
  },
  tagsStyles: {
    a: {
      color: '#0DC39F',
      textDecorationLine: 'none'
    },
    p: {
      marginTop: 0,
      marginBottom: 10
    }
  },
  classesStyles: {
    topic: {
      color: '#0DC39F',
      textDecorationLine: 'none'
    },
    mention: {
      color: '#0DC39F',
      textDecorationLine: 'none'
    },
    linkified: {
      color: '#0275d8'
    }
  }
}
