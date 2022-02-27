import React from 'react'
import { useWindowDimensions } from 'react-native'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import { openURL } from 'navigation/linking'
import { nevada } from 'style/colors'
import { useSelector } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

const HyloHTML = React.memo(
  function ({
    html,
    baseStyle: providedBaseStyle = {},
    tagsStyles: providedTagsStyles = {},
    classesStyles: providedClassessStyles = {}
  }) {
    const { width: contentWidth } = useWindowDimensions()
    const { slug: currentGroupSlug } = useSelector(getCurrentGroup)

    const handleLinkPress = async (_, href) => {
      return openURL(href, { groupSlug: currentGroupSlug })
    }

    const source = { html: wrapInHTMLBody(html) }
    const renderersProps = { a: { onPress: handleLinkPress } }
    const baseStyle = { ...renderHTMLStyles.baseStyle, ...providedBaseStyle }
    const tagsStyles = { ...renderHTMLStyles.tagsStyles, ...providedTagsStyles }
    const classesStyles = { ...renderHTMLStyles.classesStyles, ...providedClassessStyles }
    const systemFonts = [...defaultSystemFonts, 'Circular-Book']

    return (
      <RenderHTML
        source={source}
        renderersProps={renderersProps}
        baseStyle={baseStyle}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        contentWidth={contentWidth}
        systemFonts={systemFonts}
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
    linkified: {
      color: '#0275d8'
    }
  }
}
