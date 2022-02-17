import React from 'react'
import { useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import { openURL } from 'util'
import urlHandler from 'navigation/linking/urlHandler'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { nevada } from 'style/colors'

export default function HyloHTML ({
  baseStyle: providedBaseStyle = {},
  tagsStyles: providedTagsStyles = {},
  classesStyles: providedClassessStyles = {},
  onLinkPress,
  linkTargetGroupSlug,
  ...props
}) {
  const { slug: currentGroupSlug } = useSelector(getCurrentGroup)
  const { width } = useWindowDimensions()
  const handleLinkPress = (_, href, el) => {
    if (el.class === 'linkified') return openURL(href)
    return urlHandler(href, currentGroupSlug)
  }

  return (
    <RenderHTML
      renderersProps={{ a: { onPress: handleLinkPress } }}
      baseStyle={{ ...renderHTMLStyles.baseStyle, ...providedBaseStyle }}
      tagsStyles={{ ...renderHTMLStyles.tagsStyles, ...providedTagsStyles }}
      classesStyles={{ ...renderHTMLStyles.classesStyles, ...providedClassessStyles }}
      contentWidth={width}
      systemFonts={[...defaultSystemFonts, 'Circular-Book']}
      {...props}
    />
  )
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
