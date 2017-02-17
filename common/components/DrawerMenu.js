import React from 'react'
import { Button, Text, View } from 'react-native'
import mixins from '../style/mixins'

export default class DrawerMenu extends React.Component {

  render () {
    const { close } = this.props
    return <View style={styles.menu}>
      <Text>Hi! I am a drawer menu! Pleased to meet you.</Text>
      <Button onPress={close} title='Close' />
    </View>
  }
}

const styles = {
  menu: {
    ...mixins.belowStatusBar,
    backgroundColor: '#2c4059',
    padding: 10,
    flex: 1
  }
}
DrawerMenu.propTypes = {close: React.PropTypes.func}
