import React from 'react'
import { Text, View } from 'react-native'
import styles from '../Tabs.styles'
const { labelView, labelText, activeTab, inactiveTab } = styles

export default function TabLabel ({ focused, name }) {
  return (
    <View style={labelView}>
      <Text style={[labelText, focused ? activeTab : inactiveTab]}>
        {name}
      </Text>
    </View>
  )
}
