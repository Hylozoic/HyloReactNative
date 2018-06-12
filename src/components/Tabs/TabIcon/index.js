import React from 'react'
import Icon from '../../Icon'
import styles from '../Tabs.styles'
const { icon, activeTab, inactiveTab } = styles

export default function TabIcon ({ focused, name }) {
  return <Icon
    name={name}
    size={28}
    color={focused ? activeTab.color : inactiveTab.color}
    style={icon}
  />
}
