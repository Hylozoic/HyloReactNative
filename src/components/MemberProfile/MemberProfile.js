import React from 'react'
import { Text, View } from 'react-native'
import styles from './MemberProfile.styles'

export default function MemberProfile ({ navigation }) {
  return <View style={styles.container}>
    <Text>MEMBER: {navigation.state.params.id}</Text>
  </View>
}
