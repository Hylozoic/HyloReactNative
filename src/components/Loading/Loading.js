import React from 'react'
import { Text, View } from 'react-native'

export default function Loading () {
  console.log('rendering loading')
  return <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}
