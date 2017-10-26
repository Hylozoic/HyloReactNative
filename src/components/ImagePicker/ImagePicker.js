import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from '../Icon'
import RNImagePicker from 'react-native-image-picker'

/*
Example usage:

  <ImagePicker
    title='Pick an image'
    type='userAvatar'
    onChoice={({ local, remote }) => console.log('chosen', {local, remote})}
    onPendingChange={pending => this.setState({imagePickerPending: pending})}>
    {state.imagePickerPending ? showOneThing : showAnother}
  </ImagePicker>

if you don't pass any children, icons of an image and a clock will be shown for
non-pending and pending states respectively
*/
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
    const {
      title = 'Choose an image',
      onChoice,
      onCancel,
      onError,
      type,
      id = 'new',
      upload
    } = this.props

    if (this.state.pending) return
    this.setPending(true)

    const pickerOptions = {
      title,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    RNImagePicker.showImagePicker(pickerOptions, result => {
      if (result.didCancel) {
        this.setPending(false)
        onCancel && onCancel()
      } else if (result.error) {
        this.setPending(false)
        onError && onError(result.error)
      } else {
        const file = {
          uri: result.uri,
          name: result.fileName
        }

        return upload(type, id, file)
        .then(({ payload, error }) => {
          this.setPending(false)

          if (error) {
            onError && onError(payload.message)
          } else {
            onChoice({local: result.uri, remote: payload.url})
          }
        })
      }
    })
  }

  render () {
    let { children, style, iconStyle } = this.props
    const { pending } = this.state

    if (!children) {
      children = pending
        ? <Icon name='Clock' style={[styles.icon, iconStyle]} />
        : <Icon name='AddImage' style={[styles.icon, iconStyle]} />
    }

    return <View style={style}>
      <TouchableOpacity onPress={() => !pending && this.showPicker()}>
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
