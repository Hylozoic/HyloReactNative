import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import header, { tintColor } from 'util/header'
import { HeaderBackButton } from 'react-navigation'
import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityName extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Step 1/3',
      options: {
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} tintColor={tintColor} />,
        headerBackTitle: null,
        headerBackgroundColor: '#fff'
      }
    })
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  render () {
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Lets get started!</Text>
      <Text style={styles.description}>All good things start somewhere! Lets kick things off with a catchy name for your community.</Text>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={communityName => this.setInput('communityName', communityName)}
          returnKeyType='next'
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      <Button text='Continue' onPress={() => console.log('pressed')} style={styles.button} disabled={false} />
    </KeyboardFriendlyView>
  }
}
