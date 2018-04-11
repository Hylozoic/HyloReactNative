import React from 'react'
import ImagePicker from '../../ImagePicker'
import PopupMenuButton from '../../PopupMenuButton'
import { Alert, Image, View } from 'react-native'
import styles from './ImageSelector.styles'
import { partial } from 'lodash'

export default function ImageSelector ({ id, type, style, imageUrls, onAdd, onRemove, showPicker = false }) {
  return <View style={[styles.container, style]}>
    {imageUrls.map((url, index) => renderImageButton(url, index, onRemove))}
    {showPicker && <ImagePicker
      style={styles.addImageButton}
      iconStyle={styles.addImageButtonIcon}
      onError={showAlert}
      onChoice={onAdd}
      type={type}
      id={id} />}
  </View>
}
ImageSelector.defaultProps = {imageUrls: []}

function renderImageButton (imageUrl, buttonIndex, onRemove) {
  return <PopupMenuButton
    key={imageUrl}
    style={styles.addImageButton}
    actions={[['Remove image', () => onRemove(imageUrl)]]}
    destructiveButtonIndex={0}>
    <Image style={styles.addImageButtonImage} source={{uri: imageUrl}} />
  </PopupMenuButton>
}

const showAlert = partial(Alert.alert, 'Could not add image')
