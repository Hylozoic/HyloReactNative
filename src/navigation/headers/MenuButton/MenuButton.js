import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import FastImage from 'react-native-fast-image'
import Icon from 'components/Icon'
import styles from './MenuButton.styles.js'

export default function MenuButton ({ canGoBack }) {
  const navigation = useNavigation()
  const currentGroup = useSelector(getCurrentGroup)
  const avatarUrl = currentGroup?.headerAvatarUrl ||
    currentGroup?.avatarUrl
  let onPress = canGoBack
    ? navigation.goBack
    : navigation.openDrawer

  if (canGoBack && !navigation.canGoBack()) {
    onPress = () => navigation.navigate('Group Navigation')
  }

  return (
    <HeaderBackButton
      onPress={onPress}
      labelVisible={false}
      backImage={() => (
        <View style={styles.container}>
          {!canGoBack
            ? <Icon name='Hamburger' style={styles.menuIcon} />
            : <Icon name='ArrowForward' style={styles.backIcon} />}
          <FastImage source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>
      )}
    />
  )
}
