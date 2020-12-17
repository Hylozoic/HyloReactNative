import React from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'
import { propTypesForItemRowComponent } from 'screens/ItemChooser'
import Avatar from 'components/Avatar'

export default function CommunityChooserItemRow ({
  item,
  onPress
}) {
  return (
    <TouchableOpacity style={styles.communityRow} onPress={() => onPress(item)}>
      <Avatar style={styles.communityAvatar} avatarUrl={item.avatarUrl} dimension={30} />
      <Text style={styles.communityName}>{item.name}</Text>
    </TouchableOpacity>
  )
}
CommunityChooserItemRow.propTypes = propTypesForItemRowComponent

const styles = {
  communityRow: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  communityAvatar: {
    marginRight: 12
  },
  communityName: {
    fontFamily: 'Circular-Bold',
    flex: 1
  }
}
