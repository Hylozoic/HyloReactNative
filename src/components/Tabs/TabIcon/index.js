import React from 'react'

import Icon from '../../Icon'
import styles from '../Tabs.styles'

export default function TabIcon (props) {
  return <Icon
    name={props.name}
    size={25}
    style={props.focused ? styles.activeTab : styles.inactiveTab}
  />
}
