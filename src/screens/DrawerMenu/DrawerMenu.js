import React from 'react'
import {
  Image, Text, TouchableOpacity,
  View, SectionList, ImageBackground
} from 'react-native'
import styles from './DrawerMenu.styles'
import Button from 'components/Button'
import LinearGradient from 'react-native-linear-gradient'
import { bannerlinearGradientColors } from 'style/colors'

export default function DrawerMenu ({
  topGroups, myGroups, goToGroup,
  currentGroup, currentGroupId, canModerateCurrentGroup,
  goToCreateGroup, goToGroupSettings, goToInvitePeople
}) {
  const renderItem =  ({ item }) => (
    <GroupRow
      group={item}
      goToGroup={goToGroup}
      currentGroupId={currentGroupId}
      addPadding
    />
  )
  const keyExtractor = item => 'c' + item.id
  const listSections = [
    {
      data: topGroups,
      renderItem,
      keyExtractor
    },
    {
      data: myGroups,
      renderItem,
      keyExtractor
    }
  ]

  const groupBannerImage = currentGroup?.bannerUrl
    ? { uri: currentGroup?.bannerUrl }
    : null

  return (
    <View style={styles.container}>
      {currentGroup && (
        <ImageBackground source={groupBannerImage} style={styles.headerBackgroundImage}>
          <LinearGradient style={styles.headerBannerGradient} colors={bannerlinearGradientColors} />
          <View style={[styles.headerContent]}>
            <Image source={{ uri: currentGroup.avatarUrl }} style={styles.headerAvatar} />
            <Text style={styles.headerText}>{currentGroup.name}</Text>
            {canModerateCurrentGroup && (
              <View style={styles.currentGroupButtons}>
                <Button style={styles.currentGroupButton} 
                  iconName='Settings'
                  onPress={goToGroupSettings}
                  text='Settings' />
                <Button style={styles.currentGroupButton} 
                  iconName='Invite'
                  onPress={goToInvitePeople}
                  text='Invite' />
              </View>
            )}
          </View>
        </ImageBackground>
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
      <Button text='Start a Group' onPress={goToCreateGroup} style={styles.createGroupButton} />
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

export function GroupRow ({ group, goToGroup, currentGroupId, addPadding, isMember = true }) {
  const { id, avatarUrl, name } = group
  const newPostCount = Math.min(99, group.newPostCount)
  const highlight = id === currentGroupId
  return (
    <View style={[styles.groupRow, addPadding && styles.defaultPadding]}>
      <TouchableOpacity onPress={() => goToGroup(group)} style={styles.rowTouchable}>
        {!!avatarUrl &&
          <Image source={{ uri: avatarUrl }} style={styles.groupAvatar} />}
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
