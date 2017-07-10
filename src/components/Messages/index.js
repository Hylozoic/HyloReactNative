import React from 'react'
import { View, Text } from 'react-native'

export default class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  }
  render () {
    return <View>
      <Text>Messages Container</Text>
    </View>
  }
}
