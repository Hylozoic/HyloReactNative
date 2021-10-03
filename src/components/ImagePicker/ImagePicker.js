import React, { Component } from 'react'
import { View } from 'react-native'
import Icon from 'components/Icon'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import PopupMenuButton from 'components/PopupMenuButton'

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
  state = { pending: false }

  setPending (pending) {
    const { onPendingChange } = this.props
    this.setState({ pending })
    onPendingChange && onPendingChange(pending)
  }

  showPicker = () => {
    if (this.state.pending) return
    
    this.setPending(true)
    showImagePicker({
      ...this.props,
      onCancel: () => this.setPending(false),
      onComplete: () => this.setPending(false)
    })
  }

  showPickerCamera = () => {
    if (this.state.pending) return

    this.setPending(true)
    showImagePickerCamera({
      ...this.props,
      onCancel: () => this.setPending(false),
      onComplete: () => this.setPending(false)
    })
  }

  render () {
    let { children, style, iconStyle, disabled } = this.props
    const { pending } = this.state
    const MenuElement = (disabled || pending) ? View : PopupMenuButton
    const imagePickerOptions = [
      ['Choose from library', this.showPicker],
      ['Take photo', this.showPickerCamera]
    ]

    if (!children) {
      children = pending
        ? <Icon name='Clock' style={[styles.icon, iconStyle]} />
        : <Icon name='AddImage' style={[styles.icon, iconStyle]} />
    }

    return (
      <MenuElement actions={imagePickerOptions} style={style}>
        {children}
      </MenuElement>
    )
  }
}

export async function showImagePickerCamera (params) {
  return showImagePicker({ pickerFunc: launchCamera, ...params })
}

export async function showImagePicker ({
  pickerFunc = launchImageLibrary,
  onChoice,
  onCancel,
  onError,
  onComplete,
  type,
  id = 'new',
  upload,
  selectionLimit = 1
}) {
  const pickerOptions = {
    selectionLimit,
    mediaType: 'photo'
  }

  pickerFunc(pickerOptions, async result => {
    if (result.didCancel) {
      onCancel && onCancel()
    } else if (result.error) {
      onError && onError(result.error)
    } else {
      const { assets } = result
      let fileUploaders = []

      assets.forEach(asset => {
        fileUploaders = [
          ...fileUploaders,
          (async () => {
            const file = {
              uri: asset.uri,
              name: asset.fileName,
              type: asset.type
            }
            const { payload, error } = await upload(type, id, file)

            if (error) {
              onError && onError(payload.message)
            } else {
              onChoice && onChoice({ local: asset.uri, remote: payload.url })
            }
          })()
        ]
      })

      const uploadedFiles = await Promise.all(fileUploaders)

      onComplete && onComplete(uploadedFiles)
    }
  })
}

const styles = {
  icon: {
    fontSize: 36
  }
}
