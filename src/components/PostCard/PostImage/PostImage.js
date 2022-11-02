import React from 'react'
import { isEmpty } from 'lodash'
import { Dimensions, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'
import { ImageViewerButton } from 'components/ImageViewer/ImageViewer'

export default function PostImage ({ images, title, creator, linked }) {
  if (isEmpty(images)) return null

  if (linked) {
    return (
      <>
        <ImageViewerButton
          images={images}
          title={title}
          creator={creator}
          renderImages={showImageAtIndex => (
            <FastImage
              style={[styles.background, styles.container]}
              imageStyle={styles.backgroundImage}
              source={images[0]}
            >
              {images.slice(1).map((image, index) => (
                <TouchableHighlight
                  onPress={showImageAtIndex(index + 1)}
                  key={image.uri}
                  style={styles.thumbnailWrapper}
                >
                  <FastImage
                    source={image}
                    style={styles.thumbnail}
                  />
                </TouchableHighlight>
              ))}
            </FastImage>
          )}
        />
      </>
    )
  }

  return (
    <FastImage
      style={styles.background}
      imageStyle={styles.backgroundImage}
      source={images[0]}
    >
      {images.slice(1).map(image => (
        <FastImage
          key={image.uri}
          source={image}
          style={[styles.thumbnail, styles.thumbnailWrapper]}
        />
      ))}
    </FastImage>
  )
}

// this is from fudging and looking at how it turns out. since it's fixed, the
// aspect ratio of the image is slightly different between the feed and post
// details.
const backgroundHeight = Dimensions.get('window').width * 0.62

const styles = {
  background: {
    width: '100%',
    height: backgroundHeight,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  backgroundImage: {
    resizeMode: 'cover'
  },
  thumbnailWrapper: {
    margin: 8,
    marginLeft: 0
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: 'white'
  }
}
