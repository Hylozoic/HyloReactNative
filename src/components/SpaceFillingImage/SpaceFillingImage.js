import React from 'react'
import { View, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { string } from 'prop-types'

export default class SpaceFillingImage extends React.PureComponent {
  static propTypes = {
    imageUrl: string
  }

  constructor (props) {
    super(props)
    this.state = {
      imageWidth: null,
      imageHeight: null,
      containerWidth: null
    }
  }

  componentDidMount () {
    this.setDimensionsForImage()
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  componentDidUpdate (prevProps) {
    if (this.props.imageUrl !== prevProps.imageUrl) this.setDimensionsForImage()
  }

  setDimensionsForImage () {
    const { imageUrl } = this.props
    imageUrl && Image.getSize(imageUrl, (imageWidth, imageHeight) => {
      if (this.unmounted) return
      this.setState({ imageWidth, imageHeight })
    })
  }

  handleSetContainerWidth = event => {
    if (this.unmounted) return
    this.setState({ containerWidth: event.nativeEvent.layout.width })
  }

  render () {
    const { imageUrl, style } = this.props
    const { imageWidth, imageHeight, containerWidth } = this.state
    if (!imageUrl || !imageWidth) return null
    const imageStyle = {
      ...generateImageDimensions(containerWidth, imageWidth, imageHeight)
    }
    let blurredImageStyle
    if (imageWidth < containerWidth) {
      blurredImageStyle = {
        ...styles.blurredImage,
        width: containerWidth,
        height: imageHeight * (containerWidth / imageWidth)
      }
    }
    return (
      <View onLayout={this.handleSetContainerWidth} style={[style, styles.container]}>
        {imageWidth < containerWidth && (
          <FastImage
            style={blurredImageStyle}
            blurRadius={2}
            source={{ uri: imageUrl }}
          />
        )}
        <FastImage style={imageStyle} source={{ uri: imageUrl }} />
      </View>
    )
  }
}

const styles = {
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  },
  blurredImage: {
    position: 'absolute'
  }
}

export function generateImageDimensions (containerWidth, imageWidth, imageHeight) {
  const width = Math.min(containerWidth, imageWidth)
  let height
  if (width === containerWidth) {
    // image is bigger than available space, maintain aspect ratio
    height = imageHeight / (imageWidth / containerWidth)
  } else {
    // use natural width, use natural height
    // TODO: should there be a max height, and a resizing?
    height = imageHeight
  }
  return {
    width,
    height
  }
}
