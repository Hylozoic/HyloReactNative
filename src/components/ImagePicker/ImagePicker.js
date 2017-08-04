import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import RNImagePicker from 'react-native-image-picker'
import { AWS_S3_BUCKET } from 'react-native-dotenv'
import aws from 'aws-sdk'

export default class ImagePicker extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  showPicker () {
    const { title = 'Choose an image' } = this.props

    var options = {
      title,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    RNImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        this.setState({source: {uri: response.uri}})
        const s3 = new aws.S3()
        const key = '/testuploads/' + response.uri
        const body = 'data:image/png;base64,' + response.data
        return s3.upload({
          Bucket: AWS_S3_BUCKET,
          ACL: 'public-read',
          ContentType: 'image/png',
          Key: key,
          Body: body
        }).promise()
        .then(result => {
          console.log('s3 came back with', result)
        })
      }
    })
  }

  render () {
    const { source } = this.state

    return <View>
      <TouchableOpacity onPress={() => this.showPicker()}>
        <Text>Image Picker</Text>
        {!!source && <Image source={source} style={imageStyle}/>}
      </TouchableOpacity>
    </View>
  }
}

const imageStyle = {
  width: 256,
  height: 256
}
