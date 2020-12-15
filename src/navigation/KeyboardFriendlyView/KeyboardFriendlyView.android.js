import React from 'react'
import { View } from 'react-native'

export default function ({ children, ...props }) {
  return <View {...props}>{children}</View>
}
