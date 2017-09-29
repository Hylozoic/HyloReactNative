import React from 'react'
import { KeyboardAvoidingView } from 'react-native'

export default function ({ children, ...props }) {
  return <KeyboardAvoidingView {...props}>{children}</KeyboardAvoidingView>
}
