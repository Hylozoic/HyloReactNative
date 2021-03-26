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
  const listSections = [
    {
      data: parentGroups,
      renderItem,
      keyExtractor
    },
    {
      data: childGroups,
      renderItem,
      keyExtractor
    }
  ]

  return (
    <View>
      <SectionList sections={listSections} stickySectionHeadersEnabled={false} />
    </View>
  )
}

export function GroupRow ({ group, goToGroup }) {
    const { id, avatarUrl, name } = group
    const newPostCount = Math.min(99, group.newPostCount)

    return (
      <TouchableOpacity onPress={() => goToGroup(group)} style={styles.groupRow}>
        {!!avatarUrl &&
          <Image source={{ uri: avatarUrl }} style={styles.groupAvatar} />}
        <Text
          style={[styles.groupRowText]}
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
    )
  }
