import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
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
  state = {pending: false}

  setPending (pending) {
    const { onPendingChange } = this.props
    this.setState({pending})
    onPendingChange && onPendingChange(pending)
  }

  showPicker = () => {
    if (this.state.pending) return
    this.setPending(true)
    showImagePicker(this.props)
  }

  render () {
    let { children, style, iconStyle, disabled } = this.props
    const { pending } = this.state

    if (!children) {
      children = pending
        ? <Icon name='Clock' style={[styles.icon, iconStyle]} />
        : <Icon name='AddImage' style={[styles.icon, iconStyle]} />
    }

    return <TouchableOpacity
      style={style}
      onPress={() => !pending && this.showPicker()}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  }
}

export function showImagePicker ({
  title = 'Choose an image',
  onChoice,
  onCancel,
  onError,
  onComplete,
  type,
  id = 'new',
  upload
}) {
  const pickerOptions = {
    title,
    // TODO: fix take photo option on ios, then remove this
    takePhotoButtonTitle: null,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  }

  RNImagePicker.showImagePicker(pickerOptions, result => {
    if (result.didCancel) {
      onCancel && onCancel()
    } else if (result.error) {
      onError && onError(result.error)
    } else {
      const file = {
        uri: result.uri,
        name: result.fileName,
        type: result.type
      }

      return upload(type, id, file)
        .then(({ payload, error }) => {
          if (error) {
            onError && onError(payload.message)
          } else {
            onChoice({local: result.uri, remote: payload.url})
          }
          onComplete && onComplete()
        })
    }
  })
}

const styles = {
  icon: {
    fontSize: 36
  }
}
