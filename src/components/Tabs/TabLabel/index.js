import React from 'react'
import { Text } from 'react-native'

import styles from '../styles'

export default function TabLabel (props) {
  return <Text style={props.focused ? styles.activeTab : styles.inactiveTab}>
    {props.name}
  </Text>
}
