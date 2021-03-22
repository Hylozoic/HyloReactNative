import React from 'react'
import { chunk } from 'lodash/fp'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { DEFAULT_AVATAR } from 'store/models/Group'
import { caribbeanGreen } from 'style/colors'

export default function GroupsList ({
  groups = [],
  columns = 2,
  onPress,
  RightIcon
}) {
  return chunk(columns, groups).map(groupsRow =>
    <GroupRow
      groups={groupsRow}
      onPress={onPress}
      RightIcon={RightIcon}
      key={groupsRow[0]?.id}
    />)
}

export function GroupRow ({ groups = [], goToGroup, onPress, RightIcon }) {
  return (
    <View style={[styles.groupRow, styles.row]}>
      {groups.map(group =>
        <GroupCell
          group={group}
          goToGroup={goToGroup}
          onPress={onPress}
          key={group?.id}
          RightIcon={RightIcon}
        />)}
    </View>
  )
}

export function GroupCell ({ group, onPress, RightIcon }) {
  const { name, avatarUrl } = group
  const imageSource = { uri: avatarUrl || DEFAULT_AVATAR }

  return (
    <TouchableOpacity style={[styles.groupCell, styles.row]} onPress={() => onPress && onPress(group.id)}>
      <Image source={imageSource} style={styles.groupAvatar} />
      <Text style={[styles.linkText, styles.groupCell]} numberOfLines={1}>{name}</Text>
      {RightIcon && <RightIcon />}
    </TouchableOpacity>
  )
}

const styles = {
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupRow: {
    paddingVertical: 8
  },
  linkText: {
    color: caribbeanGreen,
    fontSize: 13,
    paddingRight: 10,
    fontFamily: 'Circular-Book'
  },
  groupCell: {
    marginRight: 0,
    flex: 1
  },
  groupAvatar: {
    height: 20,
    width: 20,
    borderRadius: 4,
    marginRight: 9
  }
}
