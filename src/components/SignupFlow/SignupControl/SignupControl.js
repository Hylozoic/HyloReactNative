import React from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './SignupControl.styles.js'

export default function SignupControl ({ label, value, onChange, isPassword }) {
  return <View style={styles.control}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.textInput}
      onChangeText={onChange}
      value={value}
      secureTextEntry={isPassword} />
  </View>
}
