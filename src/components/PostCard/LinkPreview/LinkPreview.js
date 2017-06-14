import React, { Component } from 'react'
import { TouchableOpacity, Image, Text } from 'react-native'
import { parse } from 'url'
import { generateImageDimensions } from '../PostCard'

export default class LinkPreview extends Component {

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

  componentDidUpdate (prevProps) {
    const image = this.props.imageUrl
    const prevImage = prevProps.imageUrl
    if (image !== prevImage) this.setDimensionsForImage()
  }

  setDimensionsForImage () {
    const imageUrl = this.props.imageUrl
    imageUrl && Image.getSize(imageUrl, (imageWidth, imageHeight) => {
      this.setState({imageWidth, imageHeight})
    })
  }

  setWidth = event => {
    this.setState({containerWidth: event.nativeEvent.layout.width})
  }

  render () {
    const { title, url, imageUrl } = this.props
    const { containerWidth, imageWidth, imageHeight } = this.state
    const imageStyle = {
      ...generateImageDimensions(containerWidth, imageWidth, imageHeight),
      ...styles.linkImage
    }
    const domain = parse(url).hostname.replace('www.', '')
    return <TouchableOpacity style={styles.linkContainer}
      onLayout={this.setWidth}
      onPress={() => console.log('TODO: open link in webview')}>
      {containerWidth && <Image style={imageStyle} source={{uri: imageUrl}} />}
      <Text style={styles.linkTitle}>{title}</Text>
      <Text style={styles.linkDomain}>{domain.toUpperCase()}</Text>
    </TouchableOpacity>
  }
}

const styles = {
  linkContainer: {
    backgroundColor: '#FAFBFC',
    borderRadius: 2,
    borderColor: '#EAEBEB',
    borderWidth: 1,
    marginTop: 19,
    marginBottom: 6
  },
  linkImage: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  linkTitle: {
    color: '#3F536E',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 7,
    marginRight: 7
  },
  linkDomain: {
    color: '#3F536E',
    fontSize: 10,
    marginBottom: 9,
    marginLeft: 7,
    marginRight: 7
  }
}
