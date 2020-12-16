import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Button from 'components/Button'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import ErrorBubble from 'components/ErrorBubble'
import styles from '../CreateCommunityFlow.styles'
import SafeAreaView from 'react-native-safe-area-view'

export default class CreateCommunityReview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      communityName: this.props.communityName,
      communityUrl: this.props.communityUrl,
      error: null
    }
  }

  submit = () => {
    const { communityName, communityUrl } = this.state
    const { createCommunity, clearNameAndUrlFromStore, goToCommunity } = this.props
    return createCommunity(communityName, communityUrl)
      .then((data) => {
        if (data.error) {
          this.setState({
            error: 'There was an error, please try again.'
          })
          return
        }
        clearNameAndUrlFromStore()
        goToCommunity(data.payload.data.createCommunity.community)
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
        <KeyboardFriendlyView {...kavProps}>
          <View style={styles.header}>
            <Text style={styles.heading}>Everything look good?</Text>
            <Text style={styles.description}>You can always come back and change your details at any time</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the name of your community?</Text>
              <View style={styles.textInputWithButton}>
                <TextInput
                  style={styles.textInput}
                  value={this.state.communityName}
                  underlineColorAndroid={styles.androidInvisibleUnderline}
                  disabled
                />
                <TouchableOpacity onPress={this.props.goToCreateCommunityName} style={styles.editContainer}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the url of your community?</Text>
              <View style={styles.textInputWithButton}>
                <TextInput
                  style={styles.textInput}
                  value={this.state.communityUrl}
                  underlineColorAndroid={styles.androidInvisibleUnderline}
                  disabled
                />
                <TouchableOpacity onPress={this.props.goToCreateCommunityUrl} style={styles.editContainer}>
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
              disabled={!!this.props.createCommunityPending}
            />
          </View>
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}
