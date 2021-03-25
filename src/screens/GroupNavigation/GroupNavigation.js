import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { rhino, rhino10, rhino50, white } from 'style/colors'
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
        <NavItem {...item} onPress={() => navigation.navigate(item.screen)} />
      )
    })}
    <View style={styles.divider} />
    <View style={styles.navItems}>
      <NavItem label='Topics' iconName='Topics' onPress={() => navigation.navigate('Topics')} />
    </View>
  </View>
}

export function NavItem ({ label, iconName, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} key={label}>
      <Icon style={styles.navItemIcon} name={iconName} />
      <Text style={styles.navItemLabel}>{label}</Text>
    </TouchableOpacity>
  )
}
export const styles = {
  container: {
    backgroundColor: white,
    flex: 1,
    padding: 20
  },
  divider: {
    marginVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: rhino
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
