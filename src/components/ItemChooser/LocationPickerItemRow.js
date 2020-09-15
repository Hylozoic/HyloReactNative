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
  return <TouchableOpacity style={styles.locationRow} onPress={() => onPress(item)}>
    <Text style={styles.locationText}>{item.fullText}</Text>
  </TouchableOpacity>
}
LocationPickerItemRow.propTypes = propTypesForItemRowComponent

const styles = {
  locationRow: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  locationText: {
    fontFamily: 'Circular-Bold',
    flex: 1
  }
}
