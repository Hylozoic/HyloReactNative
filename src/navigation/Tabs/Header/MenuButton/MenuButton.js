import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { get } from 'lodash/fp'
import styles from './MenuButton.styles.js'
import { ALL_COMMUNITIES_ID } from 'store/models/Community'

const allCommunitiesLogo = require('assets/All_Communities.png')

export default function MenuButton (props) {
  const { currentContext, openDrawer } = props
  const avatarUrl = get('avatarUrl', currentContext)
  const id = get('id', currentContext)

  const imageSource = ((id && id === ALL_COMMUNITIES_ID) || !avatarUrl)
    ? allCommunitiesLogo
    : { uri: avatarUrl }

  return (
    <TouchableOpacity onPress={openDrawer}>
      <Image
        source={imageSource}
        style={styles.avatar}
      />
    </TouchableOpacity>
  )
}
