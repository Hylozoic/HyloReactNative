import React from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'
import { propTypesForItemRowComponent } from '../ItemChooser'
import Avatar from '../Avatar'

export default function InlineEditorMentionChooserRow ({
  item,
  onPress
}) {
  return <TouchableOpacity style={styles.personRow} onPress={() => onPress(item)}>
    <Avatar style={styles.personAvatar} avatarUrl={item.avatarUrl} dimension={30} />
    <Text style={styles.personName}>{item.name}</Text>
  </TouchableOpacity>
}
InlineEditorMentionChooserRow.propTypes = propTypesForItemRowComponent

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
  }
}
