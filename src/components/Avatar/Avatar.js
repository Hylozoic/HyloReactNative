import React, { PropTypes } from 'react'
import { Image, View } from 'react-native'
import { memoize } from 'lodash'

export default function Avatar ({ size, hasBorder, hasOverlap, avatarUrl, zIndex, style }) {
  const styles = generateStyles({ size, hasBorder, hasOverlap })
  return <View style={[styles.container, {zIndex}, style]}>
    <Image style={styles.image} source={{uri: avatarUrl}} />
  </View>
}
Avatar.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  forFooter: PropTypes.bool,
  hasBorder: PropTypes.bool,
  hasOverlap: PropTypes.bool,
  zIndex: PropTypes.number
}

const generateStyles = memoize(({ size = 'medium', hasBorder, hasOverlap }) => {
  const containerSize = sizes[size]
  const imageSize = hasBorder ? containerSize - BORDER_WIDTH * 2 : containerSize
  return {
    container: {
      borderRadius: containerSize / 2,
      width: containerSize,
      height: containerSize,
      borderWidth: hasBorder ? BORDER_WIDTH : 0,
      borderColor: 'white',
      marginLeft: hasOverlap ? -11 : 0
    },
    image: {
      borderRadius: imageSize / 2,
      width: imageSize,
      height: imageSize
    }
  }
}, ({ size, hasBorder, hasOverlap }) => {
  return (size === 'small' << 2) + (hasBorder << 1) + (hasOverlap << 0)
})

const BORDER_WIDTH = 2
const sizes = {
  medium: 34,
  small: 24
}
