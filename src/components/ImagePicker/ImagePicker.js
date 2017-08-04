import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import RNImagePicker from 'react-native-image-picker'

export default class ImagePicker extends Component {

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
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        let source = { uri: response.uri }

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log('source', source)

        this.setState({
          avatarSource: source
        })
      }
    })
  }

  render () {
    return <View>
      <TouchableOpacity onPress={() => this.showPicker()}>
        <Text>Image Picker</Text>
      </TouchableOpacity>
    </View>
  }
}
