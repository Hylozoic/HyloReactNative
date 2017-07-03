import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

export default function MenuButton (props) {
  function drawerOpen () {
    props.navigation.navigate('DrawerOpen')
  }
  return <TouchableOpacity>
    <Text onPress={drawerOpen}>Menu</Text>
  </TouchableOpacity>
}
