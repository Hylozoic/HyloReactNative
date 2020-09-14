import React from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'
import { propTypesForItemRowComponent } from '../ItemChooser'

export default function LocationPickerItemRow ({
  item,
  onPress
}) {
  return <TouchableOpacity style={styles.communityRow} onPress={() => onPress(item)}>
    <Text style={styles.communityName}>Anything</Text>
  </TouchableOpacity>
}
LocationPickerItemRow.propTypes = propTypesForItemRowComponent

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
