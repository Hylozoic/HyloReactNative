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
      <Avatar style={styles.personAvatar} avatarUrl={person.avatarUrl} dimension={30} />
      <Text style={styles.personName}>{person.name}</Text>
      <RoundCheckbox
        style={styles.checkbox}
        checked={selected}
        backgroundColor={caribbeanGreen}
        onValueChange={() => onCheck(person)} />
    </View>
  </TouchableOpacity>
}

const styles = {
  personRow: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  personAvatar: {
    marginRight: 20,
    width: 20
  },
  personName: {
    fontFamily: 'Circular-Bold',
    flex: 1
  },
  checkbox: {
    marginLeft: 'auto',
    width: 50
  },
  grayed: {
    opacity: 0.2
  }
}
