import React from 'react'
import { View, Image, StatusBar } from 'react-native'
import { get } from 'lodash/fp'
import styles from './MenuButton.styles.js'
import { ALL_COMMUNITIES_ID } from 'store/models/Community'
import Icon from 'components/Icon'
import { HeaderBackButton } from '@react-navigation/stack'

const allCommunitiesLogo = require('assets/All_Communities.png')

export default function MenuButton ({
  currentContext,
  isOnTabRoot,
  navigation
}) {
  const avatarUrl = get('avatarUrl', currentContext)
  const id = get('id', currentContext)
  const imageSource = ((id && id === ALL_COMMUNITIES_ID) || !avatarUrl)
    ? allCommunitiesLogo
    : { uri: avatarUrl }
  const onPress = isOnTabRoot
    ? navigation.openDrawer
    : navigation.goBack

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
      <HeaderBackButton
        onPress={onPress}
        labelVisible={false}
        backImage={() => (
          <View style={styles.container}>
            {isOnTabRoot
              ? <Icon name='Hamburger' style={styles.menuIcon} />
              : <Icon name='ArrowForward' style={styles.backIcon} />}
            <Image source={imageSource} style={styles.avatar} />
          </View>
        )}        
      />
    </View>
  )
}
