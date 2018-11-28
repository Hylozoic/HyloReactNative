import React from 'react'
import { View, Text } from 'react-native'
import { slice } from 'lodash/fp'
import Avatar from '../Avatar'
import { rhino30 } from '../../style/colors'

export default function ProjectMembersSummary ({ members }) {
  const membersTotal = members.length
  const membersText = membersTotal
    ? `${membersTotal} member${membersTotal === 1 ? '' : 's'}`
    : 'No members'

  return <View style={styles.membersSummary}>
    {slice(0, 3, members).map((c, index) => {
      return <Avatar key={index}
        dimension={43}
        avatarUrl={c.avatarUrl}
        hasBorder
        hasOverlap={index > 0}
        zIndex={3 - index} />
    })}
    <Text style={styles.membersText}>{membersText}</Text>
  </View>
}

const styles = {
  membersSummary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  membersText: {
    paddingLeft: 6,
    color: rhino30,
    fontSize: 13,
    fontFamily: 'Circular-Book'
  }
}