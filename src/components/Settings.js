import React from 'react'
import { Button, Text, View } from 'react-native'
import { connect } from 'react-redux'

import mixins from '../style/mixins'
import { logout } from './Login/actions'

function Settings ({ navigation, logout }) {
  const { name } = navigation.state.params
  const close = () =>
    navigation.dispatch({ type: 'Navigation/BACK' })
    // navigation.goBack()// && navigation.navigate('DrawerOpen')
  return <View style={styles.view}>
    <Text>Hello, {name}! Here be settings. Arr</Text>
    <Button onPress={logout} title='Log out' />
    <Button onPress={close} title='Close' />
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
