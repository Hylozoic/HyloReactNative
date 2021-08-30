import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { havelockBlue, ghost } from 'style/colors'

export default function HeaderRightButton ({
  label,
  onPress,
  disabled = false
}) {
  if (typeof onPress !== 'function') throw new Error('HeaderRightButton: onPress is not a function.')
  console.log('!!!! HeaderRightButton rendering:', label)
  return (
    <TouchableOpacity
      style={{ marginRight: 12 }}
      onPress={onPress}
      hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
      disabled={disabled}
    >
      <Text style={[styles.button, disabled && styles.disabled]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    fontFamily: 'Circular-Book',
    fontSize: 17,
    color: havelockBlue,
    fontWeight: 'bold'
  },
  disabled: {
    color: ghost,
    fontWeight: 'normal'
  }
})
