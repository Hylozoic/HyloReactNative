import React, { PropTypes } from 'react'
import { Button, Text, View } from 'react-native'
import mixins from '../style/mixins'
import { delay } from 'lodash'

export default function DrawerMenu ({ close, showPosts, showSettings }) {
  return <View style={styles.menu}>
    <Text style={styles.text}>Hi! I am a drawer menu! Pleased to meet you.</Text>
    <Button onPress={() => [showPosts(), close()]} title='Show posts' />
    <Button onPress={() => [showSettings(), delay(close, 300)]}
      title='Show settings' />
    <Button onPress={close} title='Close menu' />
  </View>
}
DrawerMenu.propTypes = {
  close: PropTypes.func,
  showPosts: PropTypes.func,
  showSheet: PropTypes.func
}

const styles = {
  menu: {
    ...mixins.belowStatusBar,
    backgroundColor: '#2c4059',
    padding: 10,
    flex: 1
  },
  text: {
    color: 'white'
  }
}
