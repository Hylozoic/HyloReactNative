import React from 'react'
import { Text, View } from 'react-native'

import Icon from '../../Icon'
import styles from '../styles'

export default function TabIcon (name, focused) {
  return <View>
    <Icon
      name={name}
      size={25}
      style={focused ? styles.activeTab : styles.inactiveTab}
    />
    <Text style={focused ? styles.activeTab : styles.inactiveTab}>
      {name}
    </Text>
  </View>
}
