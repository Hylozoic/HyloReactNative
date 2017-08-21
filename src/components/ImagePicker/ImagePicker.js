import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from '../Icon'
import RNImagePicker from 'react-native-image-picker'
import { RNS3 } from 'react-native-aws3'
import { get } from 'lodash/fp'

// Example usage
//  <ImagePicker
//    title='Pick an image'
//    path='path/on/aws/'
//    onChoice={({ localUri, webUrl }) => console.log('chosen', {localUri, webUrl})}
//    onPendingChange={pending => this.setState({imagePickerPending: pending})}>
//    {state.imagePickerPending ? showOneThing : showAnother}
//  </ImagePicker>
// if you don't pass any children, icons of an image and a clock will be shown for
// non-pending and pending states respectively

export default class ImagePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pending: false
    }
  }

  setPending (pending) {
    const { onPendingChange } = this.props
    this.setState({pending})
    onPendingChange && onPendingChange(pending)
  }

  showPicker () {
    const { title = 'Choose an image', onChoice, onCancel, onError, path } = this.props
    const { pending } = this.state

    if (pending) return

    this.setPending(true)

    const pickerOptions = {
      title,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    RNImagePicker.showImagePicker(pickerOptions, pickerResponse => {
      if (pickerResponse.didCancel) {
        this.setPending(false)
        onCancel && onCancel()
      } else if (pickerResponse.error) {
        this.setPending(false)
        onError && onError(pickerResponse.error)
      } else {
        const file = {
          uri: pickerResponse.uri,
          name: pickerResponse.fileName,
          type: 'image/png'
        }

        const awsOptions = {
          keyPrefix: path,
          bucket: process.env.AWS_S3_BUCKET,
          region: process.env.AWS_S3_REGION,
          accessKey: process.env.AWS_ACCESS_KEY_ID,
          secretKey: process.env.AWS_SECRET_ACCESS_KEY,
          successActionStatus: 201
        }

        RNS3.put(file, awsOptions).then(awsResponse => {
          this.setPending(false)
          if (awsResponse.status !== 201) {
            throw new Error('Failed to upload image to S3')
          }
          onChoice({
            localUri: pickerResponse.uri,
            webUrl: get('body.postResponse.location', awsResponse)
          })
        })
      }
    })
  }

  render () {
    var { children, style } = this.props
    const { pending } = this.state

    if (!children) {
      children = pending
        ? <Icon name='Clock' style={styles.icon} />
        : <Icon name='AddImage' style={styles.icon} />
    }

    return <View style={style}>
      <TouchableOpacity onPress={() => this.showPicker()}>
        {children}
      </TouchableOpacity>
    </View>
  }
}

const styles = {
  icon: {
    fontSize: 36
  }
}
