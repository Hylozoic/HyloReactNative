import React from 'react'
import { isEmpty, memoize } from 'lodash'
import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native'

// maybe this will help improve performance by avoiding creating new functions
const makeOpenURL = memoize(url => () => Linking.openURL(url))

export default function PostImage ({ imageUrls, linked }) {
  if (isEmpty(imageUrls)) return null

  if (linked) {
    return <View>
      <TouchableOpacity onPress={makeOpenURL(imageUrls[0])}>
        <ImageBackground
          style={[styles.background, styles.container]}
          imageStyle={styles.backgroundImage}
          source={{uri: imageUrls[0]}}>
          {imageUrls.length > 0 && imageUrls.slice(1).map(uri =>
            <TouchableHighlight onPress={makeOpenURL(uri)} key={uri}
              style={styles.thumbnailWrapper}>
              <Image source={{uri}} style={styles.thumbnail} />
            </TouchableHighlight>)}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  }

  return <ImageBackground
    style={styles.background}
    imageStyle={styles.backgroundImage}
    source={{uri: imageUrls[0]}}>
    {imageUrls.length > 0 && imageUrls.slice(1).map(uri =>
      <Image key={uri} source={{uri}} style={styles.thumbnail} />)}
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
  thumbnailWrapper: {
    marginLeft: 8,
    marginTop: 8
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: 'white'
  }
}
