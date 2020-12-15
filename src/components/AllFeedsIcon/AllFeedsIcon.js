import React from 'react'
import { View } from 'react-native'
import Icon from 'components/Icon'
import styles from './AllFeedsIcon.styles'

export default function AllFeedsIcon ({ style }) {
  return (
    <View style={[styles.allFeedsIcon, style]}>
      <Icon name='Circle' style={[styles.purple, styles.circleIcon]} />
      <Icon name='Circle' style={[styles.blue, styles.circleIcon]} />
      <Icon name='Circle' style={[styles.green, styles.circleIcon]} />
    </View>
  )
}
