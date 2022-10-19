import React from 'react'
import { Image, FlatList } from 'react-native'
import PopupMenuButton from 'components/PopupMenuButton'
import stylesGenerator from './ImageSelector.styles'

export default function ImageSelector ({ style, imageUrls = [], onRemove }) {
  const styles = stylesGenerator(imageUrls.length)

  const renderImage = ({ item: uri, index }) => (
    <PopupMenuButton
      key={index}
      style={styles.imageActionsButton}
      actions={[['Remove image', () => onRemove(uri)]]}
      destructiveButtonIndex={0}
    >
      <Image style={styles.image} source={{ uri }} />
    </PopupMenuButton>
  )

  return (
    <FlatList
      data={imageUrls}
      style={[styles.imageGrid, style]}
      // numColumns={4}
      horizontal
      keyExtractor={(_, index) => index}
      renderItem={renderImage}
    />
  )
}
