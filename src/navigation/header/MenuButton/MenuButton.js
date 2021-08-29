import React from 'react'
import { View, Image } from 'react-native'
import { HeaderBackButton } from '@react-navigation/elements'
import { get } from 'lodash/fp'
import Icon from 'components/Icon'
import styles from './MenuButton.styles.js'


export default function MenuButton ({
  currentContext,
  canGoBack,
  navigation
}) {
  const avatarUrl = get('headerAvatarUrl', currentContext)
    || get('avatarUrl', currentContext)
  const onPress = !canGoBack
    ? navigation.openDrawer
    : navigation.goBack

  return (
    <View style={styles.container}>
      <HeaderBackButton
        onPress={onPress}
        labelVisible={false}
        backImage={() => (
          <View style={styles.container}>
            {!canGoBack
              ? <Icon name='Hamburger' style={styles.menuIcon} />
              : <Icon name='ArrowForward' style={styles.backIcon} />}
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </View>
        )}        
      />
    </View>
  )
}
