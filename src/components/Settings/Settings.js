import React from 'react'
import { Button, Text, ScrollView } from 'react-native'
import mixins from '../../style/mixins'

export default function Settings ({ currentUser, logout, close, socketStatus }) {
  return <ScrollView style={styles.view}>
    <Text>Hello, {currentUser.firstName()}! Here be settings. Arr</Text>
    <Button onPress={logout} title='Log out' />
    <Button onPress={close} title='Close' />
    <Text style={styles.debugText}>{socketStatus}</Text>
  </ScrollView>
}

const styles = {
  view: {
    padding: 10,
    backgroundColor: 'white',
    ...mixins.belowStatusBar,
    flex: 1
  },
  debugText: {
    fontSize: 10
  }
}
