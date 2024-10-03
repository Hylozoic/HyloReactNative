import React from 'react'
import { View, ImageBackground, FlatList, ActivityIndicator } from 'react-native'
import PopupMenuButton from 'components/PopupMenuButton'
import stylesGenerator from './ImageSelector.styles'
import { useTranslation } from 'react-i18next'

export default function ImageSelector ({ images = [], onRemove, style }) {
  const { t } = useTranslation()
  const styles = stylesGenerator(images.length)
  const renderImage = ({ item: image, index }) => (
    <PopupMenuButton
      key={index}
      style={styles.imageActionsButton}
      actions={[[t('Remove image'), () => onRemove(image)]]}
      destructiveButtonIndex={0}
    >
      <ImageBackground style={styles.image} source={{ uri: image.local }}>
        {!image.remote && (
          <View style={styles.imageLoading}>
            <ActivityIndicator size='large' />
          </View>
        )}
      </ImageBackground>
    </PopupMenuButton>
  )

  return (
    <FlatList
      data={images}
      horizontal
      keyExtractor={(_, index) => index}
      renderItem={renderImage}
      style={[styles.imageGrid, style]}
    />
  )
}
