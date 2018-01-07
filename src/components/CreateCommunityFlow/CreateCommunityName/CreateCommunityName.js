import React from 'react'
import {
  Text,
  View
} from 'react-native'
import Button from '../../Button'

import header, { tintColor } from 'util/header'
import { HeaderBackButton } from 'react-navigation'
import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityName extends React.Component {
  static navigationOptions = ({ navigation }) => {
    console.log('navigation', navigation)

    return header(navigation, {
      title: 'Step 1/3',
      options: {
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} tintColor={tintColor} />,
        headerBackTitle: null,
        headerBackgroundColor: '#fff'
      }
    })
  }

  render () {
    return <View style={styles.container}>
      <Text style={styles.header}>Let's get started!</Text>
      <Text style={styles.description}>All good things start somewhere! Let's kick things off with a catchy name for your community.</Text>
      <Button text='Continue' onPress={() => console.log('pressed')} style={styles.button} disabled={false} />
    </View>
  }
}
