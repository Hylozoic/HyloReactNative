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
import createCommunityHeader from '../createCommunityHeader'
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
    value = removeUrlFromDomain(value)
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
    const { communityUrl } = this.state

    this.clearErrors()
    if (!communityUrl || communityUrl.length === 0) {
      this.setState({
        ...this.state,
        error: 'Please enter a URL'
      })
      return
    }
    if (!slugValidatorRegex.test(communityUrl)) {
      this.setState({
        ...this.state,
        error: invalidSlugMessage
      })
      return
    }
    this.props.fetchCommunityExists(communityUrl)
    .then(({ error }) => {
      if (error) {
        this.setState({
          error: 'There was an error, please try again.'
        })
      }
      if (this.props.urlExists === false) {
        this.props.saveCommunityUrl(communityUrl)
        this.props.goToCreateCommunityReview()
      } else {
        this.setState({
          ...this.state,
          error: 'This url already exists. Please choose another one.'
        })
      }
    })
  }

  render () {
    const { error } = this.state
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Choose an address for your community</Text>
      <Text style={styles.description}>Your URL is the address that members will use to access your community online. The shorter the better!</Text>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={communityUrl => this.setInput('communityUrl', communityUrl)}
          returnKeyType='next'
          autoCapitalize='none'
          value={formatDomainWithUrl(this.state.communityUrl)}
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      {error && <ErrorBubble styles={null} text={error} />}
      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={!!this.props.fetchUrlPending} />
    </KeyboardFriendlyView>
  }
}
