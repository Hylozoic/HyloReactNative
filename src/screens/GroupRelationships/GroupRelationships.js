import React from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { View, Image, Text, SectionList, TouchableOpacity } from 'react-native'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import styles from './GroupRelationships.styles'

export default function GroupRelationships ({
    childGroups,
    parentGroups,
    goToGroup,
    navigation
}) {
  const currentGroup = useSelector(getCurrentGroup)

  useFocusEffect(() => {
    navigation.setOptions({ headerTitle: currentGroup.name  })
  }, [])

  const renderItem =  ({ item }) => (
    <GroupRow
      group={item}
      goToGroup={goToGroup}
      addPadding
    />
  )
  const keyExtractor = item => 'g' + item.id
  const listSections = []

  if (parentGroups.length > 0) listSections.push({
    title: `${currentGroup.name} is a part of ${parentGroups.length} Group(s)`,
    data: parentGroups,
    renderItem,
    keyExtractor
  })

  if (childGroups.length > 0) listSections.push({
    title: `${childGroups.length} Group(s) are a part of ${currentGroup.name}`,
    data: childGroups,
    renderItem,
    keyExtractor
  })

  return (
    <View style={styles.container}>
      <SectionList sections={listSections} stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>
  )
}

export function GroupRow ({ group, goToGroup }) {
    const { avatarUrl, description, name, memberCount, childGroups } = group
    const childGroupsCount = childGroups.count()

    return (
      <TouchableOpacity onPress={() => goToGroup(group)} style={styles.groupRow}>
        {!!avatarUrl &&
          <Image source={{ uri: avatarUrl }} style={styles.groupAvatar} />}
        <Text style={[styles.groupRowText]} ellipsizeMode='tail' numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.groupRowCounts]}>
          {memberCount} Members {childGroupsCount > 0 ? ` | ${childGroupsCount} Groups` : ''}
        </Text>
        {description && (
          <Text style={[styles.groupRowDescription]} ellipsizeMode='tail' numberOfLines={1}>{description}</Text>
        )}
      </TouchableOpacity>
    )
  }
