import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native'

import styles from './CreateCommunityFlow.styles'

export default class CreateCommunityUrl extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return <View style={styles.container}>
      <Text>Choose an address for your community</Text>
      <Text>Your URL is the address that members will use to access your community online. The shorter the better!</Text>
      <TouchableOpacity>
        <Button title='Continue' onPress={() => console.log('click')} />
      </TouchableOpacity>
    </View>
  }
}
