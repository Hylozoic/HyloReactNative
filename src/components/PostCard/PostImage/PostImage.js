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

export default class PostImage extends React.PureComponent {
  makeOpenURL = memoize(url => () => Linking.openURL(url))

  render () {
    const { imageUrls, linked } = this.props

    if (isEmpty(imageUrls)) return null

    if (linked) {
      return (
        <View>
          <TouchableOpacity onPress={this.makeOpenURL(imageUrls[0])}>
            <ImageBackground
              style={[styles.background, styles.container]}
              imageStyle={styles.backgroundImage}
              source={{ uri: imageUrls[0] }}
            >
              {imageUrls.length > 0 && imageUrls.slice(1).map(uri =>
                <TouchableHighlight
                  onPress={this.makeOpenURL(uri)} key={uri}
                  style={styles.thumbnailWrapper}
                >
                  <Image source={{ uri }} style={styles.thumbnail} />
                </TouchableHighlight>)}
            </ImageBackground>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <ImageBackground
        style={styles.background}
        imageStyle={styles.backgroundImage}
        source={{ uri: imageUrls[0] }}
      >
        {imageUrls.length > 0 && imageUrls.slice(1).map(uri =>
          <Image
            key={uri} source={{ uri }}
            style={[styles.thumbnail, styles.thumbnailWrapper]}
          />)}
      </ImageBackground>
    )
  }
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
    paddingTop: 6,
    paddingRight: 8,
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
