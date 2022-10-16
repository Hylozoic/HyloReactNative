import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { find } from 'lodash/fp'
import { capeCod, pictonBlue } from 'style/colors'
import { isIOS } from 'util/platform'
import { useActionSheet } from '@expo/react-native-action-sheet'
import Icon from 'components/Icon'
import { useHyloActionSheet } from 'components/PopupMenuButton/PopupMenuButton'

export default function ListControl ({ selected, options, onChange }) {
  const { showHyloActionSheet } = useHyloActionSheet()

  const actionSheetActions = options.map(option => [option.label, () => onChange(option.id)])

  return (
    <TouchableOpacity
      onPress={() => showHyloActionSheet({ actions: actionSheetActions })}
      style={styles.listControl}
    >
      <Text style={styles.optionText}>{optionText(selected, options)}</Text>
      <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
    </TouchableOpacity>
  )
}

const optionText = (id, options) => {
  const option = find(o => o.id === id, options) || options[0]
  return option.label
}

const styles = {
  listControl: {
    flexDirection: 'row'
  },
  optionText: {
    fontSize: 12,
    color: capeCod
  },
  downArrow: {
    top: isIOS ? 2 : 4,
    marginLeft: 4
  }
}
