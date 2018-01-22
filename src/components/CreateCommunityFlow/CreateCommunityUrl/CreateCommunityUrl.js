import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import ErrorBubble from '../../ErrorBubble'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import {
  slugValidatorRegex,
  invalidSlugMessage,
  formatDomainWithUrl,
  removeUrlFromDomain
} from '../util'
import Button from '../../Button'
import createCommunityHeader from '../util/createCommunityHeader'
import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityUrl extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = 'STEP 2/3'
    return createCommunityHeader(title, navigation)
  }

  constructor (props) {
    super(props)
    this.state = {
      communityUrl: this.props.communityUrl
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

  setErrorMessage = (error) => {
    this.setState({
      ...this.state,
      error
    })
  }

  validate (communityUrl) {
    this.clearErrors()
    if (!communityUrl || communityUrl.length === 0) {
      this.setErrorMessage('Please enter a URL')
      return false
    }
    if (!slugValidatorRegex.test(communityUrl)) {
      this.setErrorMessage(invalidSlugMessage)
      return false
    }
    return true
  }

  checkAndSubmit = () => {
    const { communityUrl } = this.state
    const { fetchCommunityExists } = this.props
    if (!this.validate(communityUrl)) return

    fetchCommunityExists(communityUrl)
    .then(({ error }) => {
      if (error) {
        this.setErrorMessage('There was an error, please try again.')
        return
      }
      if (this.props.urlExists === false) {
        this.props.saveCommunityUrl(communityUrl)
        this.props.goToCreateCommunityReview()
      } else {
        this.setErrorMessage('This url already exists. Please choose another one.')
      }
    })
  }

  render () {
    const { error, communityUrl } = this.state
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Choose an address for your community</Text>
      <Text style={styles.description}>Your URL is the address that members will use to access your community online. The shorter the better!</Text>
      <View style={styles.urlTextInputContainer}>
        <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={communityUrl => this.setInput('communityUrl', removeUrlFromDomain(communityUrl))}
          returnKeyType='next'
          autoCapitalize='none'
          value={formatDomainWithUrl(communityUrl)}
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View> }
      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={!!this.props.fetchUrlPending} />
    </KeyboardFriendlyView>
  }
}
