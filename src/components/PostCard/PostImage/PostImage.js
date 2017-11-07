import React from 'react'
import { isEmpty } from 'lodash'
import { Dimensions, Image, ImageBackground } from 'react-native'

export default function PostImage ({ imageUrls }) {
  if (isEmpty(imageUrls)) return null
  return <ImageBackground
    style={styles.background}
    imageStyle={styles.backgroundImage}
    source={{uri: imageUrls[0]}}>
    {imageUrls.length > 0 && imageUrls.slice(1).map(uri =>
      <Image source={{uri}} key={uri + Math.random()} style={styles.thumbnail} />)}
  </ImageBackground>
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
    justifyContent: 'flex-end',
    padding: 8
  },
  backgroundImage: {
    resizeMode: 'cover'
  },
  thumbnail: {
    width: 48,
    height: 48,
    marginLeft: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'white'
  }
}
