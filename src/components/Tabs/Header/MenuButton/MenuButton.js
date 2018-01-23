import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { get } from 'lodash/fp'
import styles from './MenuButton.styles.js'
const allCommunitiesLogo = require('../../../../assets/All_Communities.png')

export default function MenuButton (props) {
  const { currentContext, openDrawer } = props
  const avatarUrl = get('avatarUrl', currentContext)

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
