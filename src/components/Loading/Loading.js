import React from 'react'
import { Text, View } from 'react-native'

export default function Loading ({ style, text = 'Loading...' }) {
  return <View style={[style, styles.container]}>
    <Text style={styles.text}>{text}</Text>
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
