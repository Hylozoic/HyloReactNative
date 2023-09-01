import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Icon from 'components/Icon'

export default function Pill ({
  id,
  label,
  onRemove,
  displayColor = 'rgba(s, 239, 241, 1.0)',
  style,
  editable
}) {
  const [removing, setRemoving] = useState(false)
  const deletePill = () => {
    if (editable && onRemove) {
      if (removing) {
        onRemove(id, label)
      } else {
        setRemoving(true)
      }
    }
  }
  const mouseOut = () => setRemoving(false)

  const pillStyles = [
    style || styles.pill
  ]

  return (
    <View
      style={pillStyles}
      onMouseLeave={mouseOut}
    >
      <View>
        <Text style={{ color: displayColor }}>{label}</Text>
      </View>
      {editable &&
        <Icon
          name='Ex'
          onClick={deletePill}
        />}
    </View>
  )
}

const styles = {
  pill: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8
  },
  removeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'transparent',
    position: 'absolute',
    top: 1,
    right: 5,
    padding: 4,
    borderRadius: 4,
    verticalAlign: 'top'
  }
}
