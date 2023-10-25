import React from 'react'
import { useSelector } from 'react-redux'
import { Text, ScrollView, View, TouchableOpacity } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { openURL } from 'hooks/useOpenURL'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import { isContextGroup, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import Icon from 'components/Icon'
import TopicsNavigation from 'components/TopicsNavigation'
import styles from './GroupNavigation.styles'

export default function GroupNavigation () {
  const navigation = useNavigation()
  const route = useRoute()
  const currentGroup = useSelector(getCurrentGroup)
  const childGroups = useSelector(getChildGroups)
  const parentGroups = useSelector(getParentGroups)
  const { navigate } = navigation
  const customViews = (currentGroup && currentGroup.customViews && currentGroup.customViews.toRefArray()) || []
  const myHome = route?.params?.myHome

  useFocusEffect(() => {
    navigation.setOptions({ title: myHome ? 'My Home' : currentGroup?.name })
  })

  const navItems = myHome
    ? [
        { label: 'Create', iconName: 'Create', onPress: () => navigate('Edit Post', { id: null }) },
        { label: 'My Posts', iconName: 'Posticon', onPress: () => navigate('My Posts') },
        { label: 'Interactions', iconName: 'Support', onPress: () => navigate('Interactions') },
        { label: 'Mentions', iconName: 'Email', onPress: () => navigate('Mentions') },
        { label: 'Announcements', iconName: 'Announcement', onPress: () => navigate('Announcements') }
      ]
    : [
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
        { label: 'Map', iconName: 'Globe', onPress: () => navigate('Map') },
        ...customViews.filter(customView => customView.name && (customView.type !== 'externalLink' || customView.externalLink)).map(customView => ({
          label: customView.name,
          iconName: customView.icon,
          // onPress: customView.type !== 'externalLink' ? `${rootPath}/custom/${customView.id}` : false,
          onPress: customView.type === 'externalLink'
            ? () => openURL(customView.externalLink)
            : () => navigate('Feed', { customViewId: customView?.id })
        }))
      ]

  const shownNavItems = navItems.filter(navItem => !navItem?.hidden)

  return (
    <ScrollView style={styles.container}>
      {shownNavItems.map(item => <NavItem {...item} key={item.label} />)}
      {currentGroup?.id !== PUBLIC_GROUP_ID && !myHome && (
        <>
          <View style={styles.divider} />
          <View style={styles.navItems}>
            <NavItem label='Topics' iconName='Topics' onPress={() => navigate('Topics')} />
            <TopicsNavigation group={currentGroup} />
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
