import React from 'react'
import { chunk } from 'lodash/fp'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { DEFAULT_AVATAR } from '../../store/models/Community'
import { caribbeanGreen } from '../../style/colors'

export default function CommunitiesList ({
  communities = [],
  columns = 2,
  onPress,
  RightIcon
}) {
  return chunk(columns, communities).map(communitiesRow =>
    <CommunityRow
      communities={communitiesRow}
      onPress={onPress}
      RightIcon={RightIcon}
      key={communitiesRow[0].id} />)
}

export function CommunityRow ({ communities, goToCommunity, onPress, RightIcon }) {
  return <View style={[styles.communityRow, styles.row]}>
    {communities.map(community =>
      <CommunityCell
        community={community}
        goToCommunity={goToCommunity}
        onPress={onPress}
        key={community.id}
        RightIcon={RightIcon} />)}
  </View>
}

export function CommunityCell ({ community, onPress, RightIcon }) {
  const { name, avatarUrl } = community
  const imageSource = {uri: avatarUrl || DEFAULT_AVATAR}

  return <TouchableOpacity style={[styles.communityCell, styles.row]} onPress={() => onPress && onPress(community.id)}>
    <Image source={imageSource} style={styles.communityAvatar} />
    <Text style={[styles.linkText, styles.communityCell]} numberOfLines={1}>{name}</Text>
    {RightIcon && <RightIcon />}
  </TouchableOpacity>
}

const styles = {
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  communityRow: {
    paddingVertical: 8
  },
  linkText: {
    color: caribbeanGreen,
    fontSize: 13,
    paddingRight: 10,
    fontFamily: 'Circular-Book'
  },
  communityCell: {
    marginRight: 0,
    flex: 1
  },
  communityAvatar: {
    height: 20,
    width: 20,
    borderRadius: 4,
    marginRight: 9
  }
}
