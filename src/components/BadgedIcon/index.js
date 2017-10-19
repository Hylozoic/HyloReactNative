import React from 'react'
import { View } from 'react-native'
import Icon from '../Icon'
import styles from './BadgedIcon.styles'

export default function BadgedIcon (props) {
  return <View>
    <Icon { ...props } />
    {props.showBadge && <View style={styles.badgeOuter}>
      <View style={styles.badgeInner}></View>
    </View>}
  </View>
}
