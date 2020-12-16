import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import ErrorBubble from 'components/ErrorBubble'
import styles from '../CreateCommunityFlow.styles'
import createCommunityHeader from '../util/createCommunityHeader'

export default class CreateCommunityName extends React.Component {
  static navigationOptions = ({ navigation, route }) => {
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
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardFriendlyView>
          <View style={styles.header}>
            <Text style={styles.heading}>Let's get started!</Text>
            <Text style={styles.description}>All good things start somewhere! Let's kick things off with a catchy name for your community.</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the name of your community?</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={communityName => this.setInput('communityName', communityName)}
                returnKeyType='next'
                autoCapitalize='none'
                value={communityName}
                autoCorrect={false}
                underlineColorAndroid={styles.androidInvisibleUnderline}
              />
            </View>
            {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
          </View>
          <View style={styles.footer}>
            <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} />
          </View>
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}
