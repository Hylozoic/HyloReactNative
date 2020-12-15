import React from 'react'
import { View, ActivityIndicator } from 'react-native'

export default function Loading ({ style }) {
  return (
    <View style={[style, styles.container]}>
      <ActivityIndicator />
    </View>
  )
}

const styles = {
  container: {
    justifyContent: 'space-around'
  },
  text: {
    textAlign: 'center'
  }
}
