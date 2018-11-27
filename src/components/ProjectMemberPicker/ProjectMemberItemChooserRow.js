import React from 'react'
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { caribbeanGreen } from 'style/colors'
import Avatar from '../Avatar'
import RoundCheckbox from 'rn-round-checkbox'

export default function ProjectMemberItemChooserRow ({
  item: person,
  grayed,
  selected = undefined,
  onCheck = undefined,
  onPress = undefined
}) {
  return <TouchableOpacity onPress={onPress} activeOpacity={1}>
    <View style={[styles.personRow, grayed && styles.grayed]}>
      <Avatar avatarUrl={person.avatarUrl} style={styles.personAvatar} dimension={30} />
      <Text style={styles.personName}>{person.name}</Text>
      <RoundCheckbox checked={selected} backgroundColor={caribbeanGreen} onValueChange={() => onCheck(person)} />
    </View>
  </TouchableOpacity>
}

const styles = {
  personRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 225
  },
  grayed: {
    opacity: 0.2
  },
  personAvatar: {
    marginRight: 20
  },
  personName: {
    fontFamily: 'Circular-Bold'
  }
}

// Props for RoundCheckbox:
// onValueChange: PropTypes.func,
// icon: PropTypes.string,
// size: PropTypes.number,
// backgroundColor: PropTypes.string,
// iconColor: PropTypes.string,
// borderColor: PropTypes.string,
// checked: PropTypes.bool
