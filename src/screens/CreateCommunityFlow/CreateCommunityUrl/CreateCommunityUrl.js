import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { get } from 'lodash/fp'
import ErrorBubble from 'components/ErrorBubble'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import {
  slugValidatorRegex,
  invalidSlugMessage,
  formatDomainWithUrl,
  removeUrlFromDomain
} from '../util'
import Button from 'components/Button'
import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityUrl extends React.Component {
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
    const { fetchCommunityExists, saveCommunityUrl, goToCreateCommunityReview } = this.props
    if (!this.validate(communityUrl)) return
    return checkCommunityUrlThenRedirect(communityUrl,
      fetchCommunityExists,
      this.setErrorMessage,
      saveCommunityUrl,
      goToCreateCommunityReview
    )
  }

  render () {
    const { error, communityUrl } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardFriendlyView>
          <View style={styles.header}>
            <Text style={styles.heading}>Choose an address for your community</Text>
            <Text style={styles.description}>Your URL is the address that members will use to access your community online. The shorter the better!</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the address for your community?</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={communityUrl => this.setInput('communityUrl', removeUrlFromDomain(communityUrl))}
                returnKeyType='next'
                autoCapitalize='none'
                value={formatDomainWithUrl(communityUrl)}
                autoCorrect={false}
                underlineColorAndroid={styles.androidInvisibleUnderline}
              />
            </View>
            {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
          </View>
          <View style={styles.footer}>
            <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={!!this.props.fetchUrlPending} />
          </View>
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}

export function checkCommunityUrlThenRedirect (communityUrl, fetchCommunityExists, setErrorMessage, saveCommunityUrl, goToCreateCommunityReview) {
  return fetchCommunityExists(communityUrl)
    .then((data) => {
      const error = get('error', data)
      const communityExists = get('payload.data.communityExists.exists', data)
      if (error) {
        setErrorMessage('There was an error, please try again.')
        return
      }
      if (communityExists) {
        setErrorMessage('This url already exists. Please choose another one.')
        return
      }
      if (communityExists === false) {
        saveCommunityUrl(communityUrl)
        goToCreateCommunityReview()
        return
      }
      // if there is no error or communityExists variable, assume some other error
      setErrorMessage('There was an error, please try again.')
    }, () => {
      setErrorMessage('There was an error, please try again.')
    })
}
