import React from 'react'
import { Button, Text, View } from 'react-native'
import mixins from '../style/mixins'
import { connect } from 'react-redux'
import { logout } from './Login/actions'

function Settings ({ name, navigator, logout }) {
  return <View style={styles.view}>
    <Text>Hello, {name}! Here be settings. Arr</Text>
    <Button onPress={logout} title='Log out' />
    <Button onPress={navigator.pop} title='Close' />
  </View>
}

export default connect(null, {logout})(Settings)

const styles = {
  view: {
    padding: 10,
    backgroundColor: 'white',
    ...mixins.belowStatusBar,
    flex: 1
  }
}
