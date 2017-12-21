import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native'
import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityName extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return <View style={styles.container}>
      <Text style={styles.header}>Let's get started!</Text>
      <Text style={styles.description}>All good things start somewhere! Let's kick things off with a catchy name for your community.</Text>
      <TouchableOpacity>
        <Button title='Continue' onPress={() => console.log('click')} />
      </TouchableOpacity>
    </View>
  }
}
