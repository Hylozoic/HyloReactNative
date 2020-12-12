import React from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'
import { caribbeanGreen } from 'style/colors'
import { propTypesForItemRowComponent } from '../ItemChooser'
import Avatar from '../Avatar'
import RoundCheckbox from 'rn-round-checkbox'

export default function ProjectMemberItemRow ({
  item: person,
  chosen,
  toggleChosen
}) {
  return (
    <TouchableOpacity style={styles.personRow} onPress={() => toggleChosen(person)}>
      <Avatar style={styles.personAvatar} avatarUrl={person.avatarUrl} dimension={30} />
      <Text style={styles.personName}>{person.name}</Text>
      <RoundCheckbox
        style={styles.checkbox}
        checked={chosen}
        backgroundColor={caribbeanGreen}
        onValueChange={() => toggleChosen(person)}
      />
    </TouchableOpacity>
  )
}
ProjectMemberItemRow.propTypes = propTypesForItemRowComponent

const styles = {
  personRow: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  personAvatar: {
    marginRight: 12
  },
  personName: {
    fontFamily: 'Circular-Bold',
    flex: 1
  },
  checkbox: {
    marginLeft: 'auto',
    width: 50
  }
}
