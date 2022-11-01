import React, { useState } from 'react'
import { isEmpty } from 'lodash'
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native'
import ImageViewer from 'components/ImageViewer'

export default function PostImage ({ imageUrls, title, creator, linked }) {
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const toggleImageViewerVisible = () => setImageViewerVisible(!imageViewerVisible)

  if (isEmpty(imageUrls)) return null

  if (linked) {
    const images = imageUrls.map(imageUrl => ({ uri: imageUrl }))
    const showImage = imageIndex => () => {
      setSelectedImageIndex(imageIndex)
      toggleImageViewerVisible()
    }

    return (
      <>
        <View>
          <TouchableOpacity onPress={showImage(0)}>
            <ImageBackground
              style={[styles.background, styles.container]}
              imageStyle={styles.backgroundImage}
              source={{ uri: imageUrls[0] }}
            >
              {imageUrls.length > 0 &&
                imageUrls.slice(1).map((uri, index) => (
                  <TouchableHighlight
                    onPress={showImage(index + 1)}
                    key={uri}
                    style={styles.thumbnailWrapper}
                  >
                    <Image source={{ uri }} style={styles.thumbnail} />
                  </TouchableHighlight>
                ))}
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <ImageViewer
          images={images}
          title={title}
          creator={creator}
          visible={imageViewerVisible}
          imageIndex={selectedImageIndex}
          onRequestClose={toggleImageViewerVisible}
        />
      </>
    )
  }

  return (
    <ImageBackground
      style={styles.background}
      imageStyle={styles.backgroundImage}
      source={{ uri: imageUrls[0] }}
    >
      {imageUrls.length > 0 &&
        imageUrls
          .slice(1)
          .map(uri => (
            <Image
              key={uri}
              source={{ uri }}
              style={[styles.thumbnail, styles.thumbnailWrapper]}
            />
          ))}
    </ImageBackground>
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
