import React from 'react'
import { Text, TouchableOpacity, View, SectionList, Image } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'

import useChangeToGroup from 'hooks/useChangeToGroup'
import { PUBLIC_GROUP, ALL_GROUP, MY_CONTEXT_GROUP } from 'store/models/Group'
import getMemberships from 'store/selectors/getMemberships'
import getCanModerate from 'store/selectors/getCanModerate'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import styles from './DrawerMenu.styles'
import Button from 'components/Button'
import { bannerlinearGradientColors } from 'style/colors'

// import groupExplorerUrl from 'assets/group-explorer.png'
import earthUrl from 'assets/earth.png'
import myHomeUrl from 'assets/my-home.png'
import { useTranslation } from 'react-i18next'

export default function DrawerMenu () {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const currentGroup = useSelector(getCurrentGroup)
  const memberships = useSelector(getMemberships)
  const canModerateCurrentGroup = useSelector(getCanModerate)

  const myHome = route?.params?.myHome

  const myGroups = memberships
    .map(m => m.group.ref)
    .sort((a, b) => a.name.localeCompare(b.name))

  const goToCreateGroup = () => {
    navigation.navigate('Create Group', { screen: 'CreateGroupName', params: { reset: true } })
  }
  const goToGroupSettings = () => canModerateCurrentGroup &&
    navigation.navigate('Group Settings')
  // TODO RESP: defo invite poepl, not admin/cooridnator
  const goToInvitePeople = () => canModerateCurrentGroup &&
      navigation.navigate('Group Settings', { screen: 'Invite' })
  const changeToGroup = useChangeToGroup()

  const navigateToPublicStream = () => {
    navigation.navigate('Group Navigation', { groupSlug: PUBLIC_GROUP.slug })
    navigation.navigate('Feed', { initial: false })
  }

  const navigateToPublicMap = () => {
    navigation.navigate('Map', { groupSlug: PUBLIC_GROUP.slug })
  }

  // Comment-in once proper group explorer webview is available
  // const navigateToPublicGroups = () => {
  //   navigation.navigate('Group Explore') // this is not the groupexplorer webview...
  // }

  const navigateToMyHome = () => {
    navigation.navigate('Group Navigation', { myHome: true, groupSlug: MY_CONTEXT_GROUP.slug })
    navigation.navigate('My Posts', { initial: false })
  }

  const publicMap = {
    name: t('Public Map'),
    navigateTo: navigateToPublicMap,
    id: 'publicMap',
    avatarUrl: Image.resolveAssetSource(earthUrl).uri
  }

  // Comment-in once proper group explorer webview is available
  // const publicGroups = {
  //   name: 'Explore Groups',
  //   navigateTo: navigateToPublicGroups,
  //   id: 'publicGroups',
  //   avatarUrl: Image.resolveAssetSource(groupExplorerUrl).uri
  // }

  const publicRoutes = [
    { ...PUBLIC_GROUP, navigateTo: navigateToPublicStream, name: t('Public Stream')},
    // publicGroups,
    publicMap
  ]

  const renderItem = ({ item }) => (
    <GroupRow
      group={item}
      changeToGroup={changeToGroup}
      currentGroupSlug={currentGroup?.slug}
      addPadding
    />
  )

  const renderNavItem = ({ item }) => (
    <NavRow
      item={item}
      currentGroupSlug={currentGroup?.slug}
      addPadding
    />
  )
  const keyExtractor = item => 'c' + item.id
  const listSections = [
    {
      data: [{
        name: t('My Home'),
        navigateTo: navigateToMyHome,
        id: 'myHome',
        avatarUrl: Image.resolveAssetSource(myHomeUrl).uri
      }],
      renderItem: renderNavItem,
      keyExtractor
    },
    {
      data: publicRoutes,
      renderItem: renderNavItem,
      keyExtractor
    },
    {
      data: [ALL_GROUP, ...myGroups],
      renderItem,
      keyExtractor
    }
  ]
  const groupBannerImage = currentGroup?.bannerUrl
    ? { uri: currentGroup?.bannerUrl }
    : null
  return (
    <View style={styles.container}>
      {currentGroup && !myHome && (
        <FastImage source={groupBannerImage} style={styles.headerBackgroundImage}>
          <LinearGradient style={styles.headerBannerGradient} colors={bannerlinearGradientColors} />
          <View style={[styles.headerContent]}>
            <FastImage source={{ uri: currentGroup.avatarUrl }} style={styles.headerAvatar} />
            <Text style={styles.headerText}>{currentGroup.name}</Text>
            {/* TODO RESP: Will need to be adjusted for additional responsibilities */}
            {canModerateCurrentGroup && (
              <View style={styles.currentGroupButtons}>
                <Button
                  style={styles.currentGroupButton}
                  iconName='Settings'
                  onPress={goToGroupSettings}
                  text={t('Settings')}
                />
                <Button
                  style={styles.currentGroupButton}
                  iconName='Invite'
                  onPress={goToInvitePeople}
                  text={t('Invite')}
                />
              </View>
            )}
          </View>
        </FastImage>
      )}
      <SectionList
        renderSectionHeader={SectionHeader}
        SectionSeparatorComponent={({ trailingSection, leadingItem }) => (
          !trailingSection && !leadingItem
            ? <View style={styles.groupSectionSeparator} />
            : null
        )}
        sections={listSections}
        stickySectionHeadersEnabled={false}
      />
      <Button text={t('Start a Group')} onPress={goToCreateGroup} style={styles.createGroupButton} />
    </View>
  )
}

export function TextButton ({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.footerButton} hitSlop={{ top: 20, bottom: 10, left: 10, right: 15 }}>
      <Text style={{ color: 'white', fontSize: 14 }}>{text}</Text>
    </TouchableOpacity>
  )
}

export function SectionHeader ({ section }) {
  return (
    <View style={styles.sectionHeader}>
      {section.label && (
        <Text style={styles.sectionHeaderText}>{section.label.toUpperCase()}</Text>
      )}
    </View>
  )
}

export function GroupRow ({ group, changeToGroup, currentGroupSlug, addPadding, isMember = true }) {
  const { id, avatarUrl, name } = group
  const newPostCount = Math.min(99, group.newPostCount)
  const highlight = id === currentGroupSlug
  return (
    <View style={[styles.groupRow, addPadding && styles.defaultPadding]}>
      <TouchableOpacity onPress={() => changeToGroup(group?.slug, false)} style={styles.rowTouchable}>
        {!!avatarUrl &&
          <FastImage source={{ uri: avatarUrl }} style={styles.groupAvatar} />}
        <Text
          style={[styles.groupRowText, highlight && styles.highlight, isMember && styles.isMember]}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {name}
        </Text>
        {!!newPostCount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{newPostCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export function NavRow ({ item, addPadding }) {
  const { avatarUrl, name, navigateTo } = item
  return (
    <View style={[styles.groupRow, addPadding && styles.defaultPadding]}>
      <TouchableOpacity onPress={() => navigateTo()} style={styles.rowTouchable}>
        {!!avatarUrl &&
          <FastImage source={{ uri: avatarUrl }} style={styles.groupAvatar} />}
        <Text
          style={styles.groupRowText}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
