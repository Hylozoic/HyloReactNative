import React from 'react'
import { View, Image, StatusBar } from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'
import { get } from 'lodash/fp'
import { ALL_COMMUNITIES_ID } from 'routing/helpers'
import Icon from 'components/Icon'
import styles from './MenuButton.styles.js'

const allCommunitiesLogo = require('assets/All_Communities.png')

export default function MenuButton ({
  currentContext,
  canGoBack,
  navigation
}) {
  const avatarUrl = get('avatarUrl', currentContext)
  const id = get('id', currentContext)
  const imageSource = ((id && id === ALL_COMMUNITIES_ID) || !avatarUrl)
    ? allCommunitiesLogo
    : { uri: avatarUrl }
  const onPress = !canGoBack
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
            {!canGoBack
              ? <Icon name='Hamburger' style={styles.menuIcon} />
              : <Icon name='ArrowForward' style={styles.backIcon} />}
            <Image source={imageSource} style={styles.avatar} />
          </View>
        )}        
      />
    </View>
  )
}
