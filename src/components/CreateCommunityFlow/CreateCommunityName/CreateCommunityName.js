import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import Triangle from 'react-native-triangle'
import { HeaderBackButton } from 'react-navigation'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import header from 'util/header'
import styles from '../CreateCommunityFlow.styles'
import { caribbeanGreen, white, white60onCaribbeanGreen } from 'style/colors'

export default class CreateCommunityName extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Step 1/3',
      options: {
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} tintColor={white60onCaribbeanGreen} />,
        headerBackTitle: null,
        headerBackgroundColor: white
      },
      customStyles: {
        header: {
          backgroundColor: caribbeanGreen,
          paddingHorizontal: 10
        },
        title: {
          color: white
        }
      }
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      communityName: null
    }
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  checkAndSubmit = () => {
    const { communityName } = this.state
    if (!communityName || communityName.length === 0) {
      this.setState({
        ...this.state,
        error: 'Please enter a community name'
      })
    }
  }

  render () {
    const { error } = this.state
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
      {error && <FormError />}

      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={false} />
    </KeyboardFriendlyView>
  }
}

export function FormError () {
  const rowStyle = styles.errorRow
  const message = 'Username or Password was incorrect'
  return <View style={styles.errorView}>
    <View style={rowStyle}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
    <Triangle
      style={styles.triangle}
      width={10}
      height={5}
      color='white'
      direction='up' />
  </View>
}
