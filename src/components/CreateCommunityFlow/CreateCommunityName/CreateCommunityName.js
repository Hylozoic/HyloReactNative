import React from 'react'
import {
  Text,
  View,
  TextInput,
  ScrollView
} from 'react-native'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import ErrorBubble from '../../ErrorBubble'
import styles from '../CreateCommunityFlow.styles'
import createCommunityHeader from '../util/createCommunityHeader'

export default class CreateCommunityName extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = 'STEP 1/3'
    return createCommunityHeader(title, navigation)
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
    this.props.saveCommunityName(communityName)
    this.props.goToCreateCommunityUrl()
  }

  render () {
    const { error, communityName } = this.state
    return <ScrollView>
      <KeyboardFriendlyView style={styles.container}>
        <Text style={styles.header}>Let's get started!</Text>
        <Text style={styles.description}>All good things start somewhere! Let's kick things off with a catchy name for your community.</Text>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>What's the name of your community?</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={communityName => this.setInput('communityName', communityName)}
            returnKeyType='next'
            autoCapitalize='none'
            value={communityName}
            autoCorrect={false}
            underlineColorAndroid={styles.androidInvisibleUnderline} />
        </View>
        {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
        <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} />
      </KeyboardFriendlyView>
    </ScrollView>
  }
}
