import React from 'react'
import { useSelector } from 'react-redux'
import { Text, ScrollView, View, TouchableOpacity } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import useHyloQuery from 'urql-shared/hooks/useHyloQuery'
import { openURL } from 'hooks/useOpenURL'
import useRouteParams from 'hooks/useRouteParams'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import { isContextGroup, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import Icon from 'components/Icon'
import TopicsNavigation from 'components/TopicsNavigation'
import styles from './GroupNavigation.styles'
import Loading from 'components/Loading'

export default function GroupNavigation () {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const currentGroup = useSelector(getCurrentGroup)
  console.error(currentGroup?.slug)
  const [{ data, fetching, error }] = useHyloQuery({ action: fetchGroupDetails({ slug: currentGroup?.slug }) })
  const childGroups = useSelector(getChildGroups)
  const parentGroups = useSelector(getParentGroups)
  const { navigate } = navigation
  const customViews = (currentGroup && currentGroup.customViews && currentGroup.customViews.toRefArray()) || []
  const { myHome } = useRouteParams()

  useFocusEffect(() => {
    navigation.setOptions({ title: myHome ? t('My Home') : currentGroup?.name })
  })

  if (fetching && currentGroup?.slug) {
    return <Loading />
  }
  // console.error('!!!!! data', currentGroup?.slug, data?.customViews)

  const navItems = myHome
    ? [
        { label: t('Create'), iconName: 'Create', onPress: () => navigate('Edit Post', { id: null }) },
        { label: t('My Posts'), iconName: 'Posticon', onPress: () => navigate('My Posts') },
        { label: t('Interactions'), iconName: 'Support', onPress: () => navigate('Interactions') },
        { label: t('Mentions'), iconName: 'Email', onPress: () => navigate('Mentions') },
        { label: t('Announcements'), iconName: 'Announcement', onPress: () => navigate('Announcements') }
      ]
    : [
        { label: t('Create'), iconName: 'Create', onPress: () => navigate('Edit Post', { id: null }) },
        { label: t('Stream'), iconName: 'Stream', onPress: () => navigate('Feed') },
        {
          label: t('Explore'),
          iconName: 'Binoculars',
          onPress: () => navigate('Group Explore', { groupSlug: currentGroup?.slug }),
          hidden: isContextGroup(currentGroup?.slug)
        },
        { label: t('Projects'), iconName: 'Projects', onPress: () => navigate('Projects') },
        { label: t('Events'), iconName: 'Events', onPress: () => navigate('Events') },
        {
          label: t('Members'),
          iconName: 'Members',
          onPress: () => navigate('Members'),
          hidden: isContextGroup(currentGroup?.slug)
        },
        {
          label: t('Groups'),
          iconName: 'Groups',
          onPress: () => navigate('Group Relationships'),
          hidden: !(childGroups?.length > 0 || parentGroups?.length > 0)
        },
        { label: t('Map'), iconName: 'Globe', onPress: () => navigate('Map') },
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
            <NavItem label={t('Topics')} iconName='Topics' onPress={() => navigate('Topics')} />
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
