import React from 'react'
import { useSelector } from 'react-redux'
import { Text, ScrollView, View, TouchableOpacity } from 'react-native'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import Icon from 'components/Icon'
import { useFocusEffect } from '@react-navigation/core'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import styles from './GroupNavigation.styles'

export default function GroupNavigation ({ navigation }) {
  const currentGroup = useSelector(getCurrentGroup)

  useFocusEffect(() => {
    navigation.setOptions({ headerTitle: currentGroup.name  })
  }, [])

  const { navigate } = navigation
  // HOLONIC TODO: Add icons to set for "Create", "Stream", "Groups",
  //       as well as "Home" and "Events" (for the future)
  const navItems = [
    { label: 'Create', iconName: 'Create', onPress: () => navigate('Edit Post', { id: null }) },
    { label: 'Stream', iconName: 'Stream', onPress: () => navigate('Feed') },
    { label: 'Projects', iconName: 'Projects', onPress: () =>  navigate('Projects') }
  ]
  const childGroups = useSelector(getChildGroups)
  const parentGroups = useSelector(getParentGroups)

  // TODO: Only show in Single Group context (not Public or All Groups)
  if (true) {
    navItems.push({ label: 'Members', iconName: 'Members', onPress: () => navigate('Members') })
  }

  if (childGroups.length > 0 || parentGroups.length > 0) {
    navItems.push({ label: 'Groups', iconName: 'Groups', onPress: () => navigate('Group Relationships') })
  }

  const NavItem  = ({ label, iconName, onPress }) => (
    <TouchableOpacity style={styles.navItem} onPress={onPress} key={label}>
      <Icon style={styles.navItemIcon} name={iconName} />
      <Text style={styles.navItemLabel}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      {navItems.map(item => <NavItem {...item} key={item.label} /> )}
      <View style={styles.divider} />
      <View style={styles.navItems}>
        <NavItem label='Topics' iconName='Topics' onPress={() => navigate('Topics')} />
      </View>
    </ScrollView>
  )
}
