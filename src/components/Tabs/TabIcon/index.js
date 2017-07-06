import React from 'react'
import { Text, View } from 'react-native'

import Icon from '../../Icon'
import styles from '../styles'

export default function TabIcon (props) {
  console.log('TabIcon')
  console.log(props)
  return <View>
    <Icon
      name={props.name}
      size={25}
      style={props.focused ? styles.activeTab : styles.inactiveTab}
    />
    <Text style={props.focused ? styles.activeTab : styles.inactiveTab}>
      {props.name}
    </Text>
  </View>
}
