import React from 'react'
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
// import { some } from 'lodash/fp'
import { capeCod, white, caribbeanGreen, alabaster, rhino30, rhino } from 'style/colors'
import Icon from 'components/Icon'

const GROUP_NAVIGATION_ITEMS = [
    { label: 'Create', iconName: 'Create', screen: 'Create' },
    // { label: 'Home', iconName: 'Home', screen: 'Home' },
    { label: 'Stream', iconName: 'Stream', screen: 'Feed' },
    { label: 'Projects', iconName: 'Projects', screen: 'Projects' },
    // { label: 'Events', iconName: 'Events', screen: 'Events'  },
    { label: 'Members', iconName: 'Person', screen: 'Members' },
    { label: 'Groups', iconName: 'Share', screen: 'Group Relationships' }
]

export default function GroupNavigation ({ group, navigation }) {
  return <View style={styles.container}>
    {GROUP_NAVIGATION_ITEMS.map(item => {
      return (
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate(item.screen)} key={item.label}>
          <Icon style={styles.navItemIcon} name={item.iconName} />
          <Text style={styles.navItemLabel}>{item.label}</Text>
        </TouchableOpacity>
      )
    })}
  </View>
}

export const styles = {
  container: {
    backgroundColor: white,
    flex: 1,
    padding: 20
  },
  navItem: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  navItemIcon: {
    fontSize: 24,
    paddingRight: 10
  },
  navItemLabel: {
    fontSize: 24

  }
}
