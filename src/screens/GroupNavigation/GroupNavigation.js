import React from 'react'
import { useSelector } from 'react-redux'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import Icon from 'components/Icon'
import { rhino, white } from 'style/colors'

export default function GroupNavigation ({ navigation }) {
  const { navigate } = navigation
  const navItems = [
    { label: 'Create', iconName: 'Create',
      onPress: () => navigate('Edit Post', { id: null }) },
    // { label: 'Home', iconName: 'Home', screen: 'Home' },
    { label: 'Stream', iconName: 'Stream', onPress: () => navigate('Feed') },
    { label: 'Projects', iconName: 'Projects', onPress: () =>  navigate('Projects') },
    // { label: 'Events', iconName: 'Events', screen: 'Events'  },
    { label: 'Members', iconName: 'Person', onPress: () => navigate('Members') }
  ]
  const childGroups = useSelector(getChildGroups)
  const parentGroups = useSelector(getParentGroups)
  if (childGroups.length > 0 || parentGroups.length > 0) {
    navItems.push({ label: 'Groups', iconName: 'Share', screen: 'Group Relationships' })
  }

  return (
    <View style={styles.container}>
      {navItems.map(item => (
        <NavItem {...item} />
      ))}
      <View style={styles.divider} />
      <View style={styles.navItems}>
        <NavItem label='Topics' iconName='Topics' onPress={() => navigation.navigate('Topics')} />
      </View>
    </View>
  )
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
