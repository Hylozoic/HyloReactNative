import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ErrorBubble from 'components/ErrorBubble'
import styles from '../CreateGroupFlow.styles'

export default class CreateGroupName extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      groupName: this.props.groupName
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
    const { groupName } = this.state

    this.clearErrors()
    if (!groupName || groupName.length === 0) {
      this.setState({
        ...this.state,
        error: 'Please enter a group name'
      })
      return
    }
    this.props.saveGroupName(groupName)
    this.props.goToCreateGroupUrl()
  }

  render () {
    const { error, groupName } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardFriendlyView>
          <View style={styles.header}>
            <Text style={styles.heading}>Let's get started!</Text>
            <Text style={styles.description}>All good things start somewhere! Let's kick things off with a catchy name for your group.</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the name of your group?</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={groupName => this.setInput('groupName', groupName)}
                returnKeyType='next'
                autoCapitalize='none'
                value={groupName}
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
