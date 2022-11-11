import React from 'react'
import { Dimensions, TouchableHighlight, View } from 'react-native'
import { isEmpty } from 'lodash'
import FastImage from 'react-native-fast-image'
import { ImageViewerButton } from 'components/ImageViewer/ImageViewer'

export default function ImageAttachments ({
  children,
  creator,
  images,
  style,
  title,
  viewer
}) {
  if (isEmpty(images)) return null

  if (viewer) {
    return (
      <>
        <ImageViewerButton
          images={images}
          title={title}
          creator={creator}
          style={style}
          renderImages={showImageAtIndex => (
            <FastImage
              imageStyle={styles.backgroundImage}
              source={images[0]}
            >
              <View style={styles.container}>
                <View>{children}</View>
                <View style={styles.background}>
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
                </View>
              </View>
            </FastImage>
          )}
        />
      </>
    )
  }

  return (
    <FastImage
      imageStyle={styles.backgroundImage}
      source={images[0]}
      style={style}
    >
      <View style={styles.container}>
        <View>{children}</View>
        <View style={styles.background}>
          {images.slice(1).map(image => (
            <FastImage
              key={image.uri}
              source={image}
              style={[styles.thumbnail, styles.thumbnailWrapper]}
            />
          ))}
        </View>
      </View>
    </FastImage>
  )
}

// this is from fudging and looking at how it turns out. since it's fixed, the
// aspect ratio of the image is slightly different between the feed and post
// details.
const backgroundHeight = Dimensions.get('window').width * 0.62

const styles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: backgroundHeight
  },
  background: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  backgroundImage: {
    resizeMode: 'cover'
  },
  thumbnailWrapper: {
    margin: 8,
    marginLeft: 4
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: 'white'
  }
}
