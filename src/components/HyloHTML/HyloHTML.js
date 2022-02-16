import React from 'react'
import { StyleSheet, Linking, useWindowDimensions } from 'react-native'
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html'
import { nevada } from 'style/colors'

const systemFonts = [...defaultSystemFonts, 'Circular-Book']

export default function HyloHTML ({
  baseStyle: providedBaseStyle = {},
  tagsStyles: providedTagsStyles = {},
  classesStyles: providedClassessStyles = {},
  onLinkPress,
  ...props
}) {
  const { width } = useWindowDimensions()
  return (
    <RenderHTML
      renderersProps={{
        a: {
          onPress: (_, href) => {
            if (onLinkPress) return onLinkPress(_, href)
            return Linking.openURL(href)
          }
        }
      }}
      baseStyle={{ ...renderHTMLStyles.baseStyle, ...providedBaseStyle }}
      tagsStyles={{ ...renderHTMLStyles.tagsStyles, ...providedTagsStyles }}
      classesStyles={{ ...renderHTMLStyles.classesStyles, ...providedClassessStyles }}
      contentWidth={width}
      systemFonts={systemFonts}
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
