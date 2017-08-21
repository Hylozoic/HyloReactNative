import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { get } from 'lodash/fp'
const allCommunitiesLogo = require('../../../../assets/All_Communities.png')

import styles from './MenuButton.styles.js'

export default function MenuButton (props) {
  const { currentCommunity, openDrawer } = props
  const avatarUrl = get('avatarUrl', currentCommunity)

  const imageSource = avatarUrl
    ? {uri: avatarUrl}
    : allCommunitiesLogo

  return <TouchableOpacity onPress={openDrawer}>
    <Image
      source={imageSource}
      style={styles.avatar}
    />
  </TouchableOpacity>
}
