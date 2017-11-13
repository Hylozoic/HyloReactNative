import React from 'react'
import ImagePicker from '../../ImagePicker'
import PopupMenuButton from '../../PopupMenuButton'
import { Image, View } from 'react-native'
import styles from './ImageSelector.styles'

export default function ImageSelector ({ id, type, style, imageUrls, onAdd, onRemove }) {
  return <View style={[styles.container, style]}>
    {imageUrls.map((url, index) => renderImageButton(url, index, onRemove))}
    <ImagePicker
      style={styles.addImageButton}
      iconStyle={styles.addImageButtonIcon}
      onError={err => console.log(err)}
      onChoice={onAdd}
      type={type}
      id={id} />
  </View>
}
ImageSelector.defaultProps = {imageUrls: []}

function renderImageButton (imageUrl, buttonIndex, onRemove) {
  return <PopupMenuButton
    key={imageUrl}
    style={styles.addImageButton}
    actions={['Remove image']}
    destructiveButtonIndex={0}
    onSelect={menuIndex => onRemove(imageUrl)}>
    <Image style={styles.addImageButtonImage} source={{uri: imageUrl}} />
  </PopupMenuButton>
}
