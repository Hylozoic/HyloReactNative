import React from 'react'
import { View } from 'react-native'
import {
    rhino80, linkWater
} from 'style/colors'
import Icon from '../Icon'

export default function StarIcon ({ style }) {
  return <View style={[styles.starWrapper, style]}>
    <View style={styles.starBackground} />
    <Icon name='Star' style={styles.starIcon} />
  </View>
}

const styles = {
  starWrapper: {
    position: 'relative'
  },
  starBackground: {
    borderRadius: 100,
    width: 13,
    height: 13,
    backgroundColor: rhino80,
    position: 'absolute',
    top: 3,
    right: 4
  },
  starIcon: {
    color: linkWater,
    fontSize: 20,
    backgroundColor: 'transparent'
  }
}
