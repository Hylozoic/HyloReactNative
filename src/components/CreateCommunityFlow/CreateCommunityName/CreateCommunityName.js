import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import ErrorBubble from '../../ErrorBubble'
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
      communityName: this.props.communityName
    }
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  clearErrors = () => {
    this.setState({
      ...this.state,
      error: null
    })
  }

  checkAndSubmit = () => {
    const { communityName } = this.state

    this.clearErrors()
    if (!communityName || communityName.length === 0) {
      this.setState({
        ...this.state,
        error: 'Please enter a community name'
      })
      return
    }

    this.setState({
      ...this.state,
      error: null
    })
    this.props.saveCommunityName(communityName)
    this.props.goToCreateCommunityUrl()
  }

  render () {
    const { error, communityName } = this.state
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
          value={communityName}
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      {error && <ErrorBubble styles={null} text={'Please enter a community name'} />}

      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={false} />
    </KeyboardFriendlyView>
  }
}
