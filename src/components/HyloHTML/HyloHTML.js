import React from 'react'
import { useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import { openURL } from 'navigation/linking'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { nevada } from 'style/colors'

export default React.memo(function HyloHTML ({
  baseStyle: providedBaseStyle = {},
  tagsStyles: providedTagsStyles = {},
  classesStyles: providedClassessStyles = {},
  onLinkPress,
  linkTargetGroupSlug,
  source: providedSource,
  ...props
}) {
  const { slug: currentGroupSlug } = useSelector(getCurrentGroup)
  const { width } = useWindowDimensions()
  const handleLinkPress = async (_, href) => {
    return openURL(href, { groupSlug: currentGroupSlug })
  }
  const source = providedSource?.html
    ? { html: wrapInHTMLBody(providedSource.html) }
    : providedSource

  return (
    <RenderHTML
      source={source}
      renderersProps={{ a: { onPress: handleLinkPress } }}
      baseStyle={{ ...renderHTMLStyles.baseStyle, ...providedBaseStyle }}
      tagsStyles={{ ...renderHTMLStyles.tagsStyles, ...providedTagsStyles }}
      classesStyles={{ ...renderHTMLStyles.classesStyles, ...providedClassessStyles }}
      contentWidth={width}
      systemFonts={[...defaultSystemFonts, 'Circular-Book']}
      {...props}
    />
  )
})

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
