import React, { Component, useState } from 'react'
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

export default function ImagePicker (props) {
  const { onPendingChange, style, iconStyle, disabled } = props  
  const [pending, providedSetPending] = useState(false)

  const setPending = pending => {
    providedSetPending(pending)
    onPendingChange && onPendingChange(pending)
  }

  const showPicker = async () => {
    if (pending) return
    
    setPending(true)
    await showImagePicker({
      ...props,
      includeExif: true,
      onCancel: () => setPending(false),
      onComplete: () => setPending(false)
    })
  }

  const showPickerCamera = async () => {
    if (pending) return

    setPending(true)
    await showImagePickerCamera({
      ...props,
      includeExif: true,
      compressImageQuality: 0.99,
      onCancel: () => setPending(false),
      onComplete: () => setPending(false)
    })
  }

  const MenuElement = (disabled || pending)
    ? View
    : PopupMenuButton
  const imagePickerOptions = [
    ['Choose from library', showPicker],
    ['Take photo', showPickerCamera]
  ]
  const children = pending
    ? <Icon name='Clock' style={[styles.icon, iconStyle]} />
    : <Icon name='AddImage' style={[styles.icon, iconStyle]} />

  return (
    <MenuElement actions={imagePickerOptions} style={style}>
      {props.children || children}
    </MenuElement>
  )
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
