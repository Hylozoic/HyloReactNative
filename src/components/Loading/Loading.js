import React from 'react'
import { Text, View } from 'react-native'

export default function Loading ({ style }) {
  return <View style={[style, styles.container]}>
    <Text style={styles.text}>Loading...</Text>
  </View>
}

const styles = {
  container: {
    justifyContent: 'space-around'
  },
  text: {
    textAlign: 'center'
  }
}
