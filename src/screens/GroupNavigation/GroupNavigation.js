import React from 'react'
import { useSelector } from 'react-redux'
import { Text, ScrollView, View, TouchableOpacity } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import { isContextGroup, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import Icon from 'components/Icon'
import styles from './GroupNavigation.styles'

export default function GroupNavigation () {
  const navigation = useNavigation()
  const currentGroup = useSelector(getCurrentGroup)
  const childGroups = useSelector(getChildGroups)
  const parentGroups = useSelector(getParentGroups)

  useFocusEffect(() => {
    navigation.setOptions({ title: currentGroup?.name })
  })

  const { navigate } = navigation
  const navItems = [
    { label: 'Create', iconName: 'Create', onPress: () => navigate('Edit Post', { id: null }) },
    { label: 'Stream', iconName: 'Stream', onPress: () => navigate('Feed') },
    {
      label: 'Explore',
      iconName: 'Binoculars',
      onPress: () => navigate('Group Explore', { groupSlug: currentGroup?.slug }),
      hidden: isContextGroup(currentGroup?.slug)
    },
    { label: 'Projects', iconName: 'Projects', onPress: () => navigate('Projects') },
    { label: 'Events', iconName: 'Events', onPress: () => navigate('Events') },
    {
      label: 'Members',
      iconName: 'Members',
      onPress: () => navigate('Members'),
      hidden: isContextGroup(currentGroup?.slug)
    },
    {
      label: 'Groups',
      iconName: 'Groups',
      onPress: () => navigate('Group Relationships'),
      hidden: !(childGroups?.length > 0 || parentGroups?.length > 0)
    },
    { label: 'Map', iconName: 'Globe', onPress: () => navigate('Map') }
  ]

  const shownNavItems = navItems.filter(navItem => !navItem?.hidden)

  return (
    <ScrollView style={styles.container}>
      {shownNavItems.map(item => <NavItem {...item} key={item.label} />)}
      {currentGroup?.id !== PUBLIC_GROUP_ID && (
        <>
          <View style={styles.divider} />
          <View style={styles.navItems}>
            <NavItem label='Topics' iconName='Topics' onPress={() => navigate('Topics')} />
          </View>
        </>
      )}
    </ScrollView>
  )
}

const NavItem = ({ label, iconName, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} key={label}>
    <Icon style={styles.navItemIcon} name={iconName} />
    <Text style={styles.navItemLabel}>{label}</Text>
  </TouchableOpacity>
)
