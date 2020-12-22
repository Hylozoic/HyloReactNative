import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'components/Icon'
import { white } from 'style/colors'

export default function HeaderLeftCloseIcon ({
  onPress,
  color = white,
  disabled
} ) {
  if (typeof onPress !== 'function') throw new Error('LeftHeaderClose: onPress is not a function.')
  
  return (
    <TouchableOpacity
      style={{ marginRight: 12 }}
      onPress={onPress}
      hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
      disabled={disabled}
    >
      <Icon name='Ex' style={styles.exIcon} color={color} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  exIcon: {
    fontSize: 20,
    padding: 7
  }
})
