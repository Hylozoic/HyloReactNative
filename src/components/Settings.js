import React from 'react'
import { Button, Text, View } from 'react-native'
import mixins from '../style/mixins'

export default function Settings ({ name, navigator }) {
  return <View style={styles.view}>
    <Text>Hello, {name}! Here be settings. Arr</Text>
    <Button onPress={navigator.pop} title='Close' />
  </View>
}

const styles = {
  view: {
    padding: 10,
    backgroundColor: 'white',
    ...mixins.belowStatusBar,
    flex: 1
  }
}
