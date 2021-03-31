import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ErrorBubble from 'components/ErrorBubble'
import styles from '../CreateGroupFlow.styles'
import SafeAreaView from 'react-native-safe-area-view'

export default class CreateGroupReview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      groupName: this.props.groupName,
      groupUrl: this.props.groupUrl,
      error: null
    }
  }

  submit = () => {
    const { groupName, groupUrl } = this.state
    const { createGroup, clearCreateGroupStore, goToGroup } = this.props
    return createGroup(groupName, groupUrl)
      .then((data) => {
        if (data.error) {
          this.setState({
            error: 'There was an error, please try again.'
          })
          return
        }
        clearCreateGroupStore()
        goToGroup(data.payload.data.createGroup.group)
      })
      .catch(() => {
        this.setState({
          error: 'There was an error, please try again.'
        })
      })
  }

  render () {
    const { error } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardFriendlyView>
          <View style={styles.header}>
            <Text style={styles.heading}>Everything look good?</Text>
            <Text style={styles.description}>You can always come back and change your details at any time</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the name of your group?</Text>
              <View style={styles.textInputWithButton}>
                <TextInput
                  style={styles.textInput}
                  value={this.state.groupName}
                  underlineColorAndroid={styles.androidInvisibleUnderline}
                  disabled
                />
                <TouchableOpacity onPress={this.props.goToCreateGroupName} style={styles.editContainer}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the url of your group?</Text>
              <View style={styles.textInputWithButton}>
                <TextInput
                  style={styles.textInput}
                  value={this.state.groupUrl}
                  underlineColorAndroid={styles.androidInvisibleUnderline}
                  disabled
                />
                <TouchableOpacity onPress={this.props.goToCreateGroupUrl} style={styles.editContainer}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            {error && <View style={styles.errorBubble}><ErrorBubble text={error} /></View>}
          </View>
          <View style={styles.footer}>
            <Button
              text="Let's Do This!"
              onPress={this.submit}
              style={styles.button}
              disabled={!!this.props.createGroupPending}
            />
          </View>
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}
