import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import ErrorBubble from '../../ErrorBubble'
import styles from '../CreateCommunityFlow.styles'
import { caribbeanGreen, white, white60onCaribbeanGreen } from 'style/colors'

export default class CreateCommunityReview extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: <Text style={styles.headerTitle}>STEP 3/3</Text>,
      color: white,
      fontSize: 10,
      headerStyle: {
        backgroundColor: caribbeanGreen,
        borderBottomWidth: 0
      },
      headerBackgroundColor: caribbeanGreen,
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} tintColor={white60onCaribbeanGreen} />
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      communityName: this.props.communityName,
      communityUrl: this.props.communityUrl
    }
  }

  submit = () => {
    const { communityName, communityUrl } = this.state
    this.props.createCommunity(communityName, communityUrl)
    .then(({error}) => {
      if (error) {
        this.setState({
          error: 'There was an error, please try again.'
        })
      }
      console.log('hello')
      this.props.clearNameAndUrlFromStore()
    })
  }

  render () {
    const { error } = this.state
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Everything look good?</Text>
      <Text style={styles.description}>You can always come back and change your details at any time</Text>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
        <View style={styles.textInputWithButton}>
          <TextInput
            style={styles.reviewTextInput}
            onChangeText={communityName => this.setInput('communityName', communityName)}
            returnKeyType='next'
            autoCapitalize='none'
            value={this.state.communityName}
            autoCorrect={false}
            underlineColorAndroid={styles.androidInvisibleUnderline}
            disabled
          />
          <TouchableOpacity onPress={this.props.goToCreateCommunityName} style={styles.editContainer}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.secondTextInputContainer}>
        <Text style={styles.textInputLabel}>Whats the url of your community?</Text>
        <View style={styles.textInputWithButton}>
          <TextInput
            style={styles.reviewTextInput}
            onChangeText={communityName => this.setInput('communityName', communityName)}
            returnKeyType='next'
            autoCapitalize='none'
            value={this.state.communityUrl}
            autoCorrect={false}
            underlineColorAndroid={styles.androidInvisibleUnderline}
            disabled
          />
          <TouchableOpacity onPress={this.props.goToCreateCommunityUrl} style={styles.editContainer}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {error && <ErrorBubble styles={null} text={error} />}
      </View>
      <Button text="Let's Do This!" onPress={this.submit} style={styles.button} disabled={false} />
    </KeyboardFriendlyView>
  }
}
