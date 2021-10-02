import React from 'react'
import { Text } from 'react-native'
import { find } from 'lodash/fp'
import { capeCod } from 'style/colors'
import { isIOS } from 'util/platform'
import Icon from 'components/Icon'
import PopupMenuButton from 'components/PopupMenuButton'

export default function ListControl ({ selected, options, onChange }) {
  const actions = options.map(option => [
    option.label,
    () => onChange(option.id)
  ])

  return (
    <PopupMenuButton
      actions={actions}
      style={styles.listControl}
    >
      <Text style={styles.optionText}>{optionText(selected, options)}</Text>
      <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
    </PopupMenuButton>
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
