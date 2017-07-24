import React from 'react'
import { View } from 'react-native'

import ThreadList from '../ThreadList'
import Header from './Header'

export default class Messages extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation))

  render () {
    return <View>
      <ThreadList />
    </View>
  }
}
