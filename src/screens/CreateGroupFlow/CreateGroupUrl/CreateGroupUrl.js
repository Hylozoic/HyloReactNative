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
import styles from '../CreateGroupFlow.styles'

export default class CreateGroupUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      slug: this.props.groupData?.slug
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

  validate (slug) {
    this.clearErrors()
    if (!slug || slug.length === 0) {
      this.setErrorMessage('Please enter a URL')
      return false
    }
    if (!slugValidatorRegex.test(slug)) {
      this.setErrorMessage(invalidSlugMessage)
      return false
    }
    return true
  }

  checkAndSubmit = () => {
    const { slug } = this.state
    const { fetchGroupExists, updateGroupData, goToNextStep } = this.props
    if (!this.validate(slug)) return
    return checkGroupUrlThenRedirect(slug,
      fetchGroupExists,
      this.setErrorMessage,
      updateGroupData,
      goToNextStep
    )
  }

  render () {
    const { error, slug } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardFriendlyView>
          <View style={styles.header}>
            <Text style={styles.heading}>Choose an address for your group</Text>
            <Text style={styles.description}>Your URL is the address that members will use to access your group online. The shorter the better!</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputLabel}>What's the address for your group?</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={slug => this.setInput('slug', removeUrlFromDomain(slug))}
                returnKeyType='next'
                autoCapitalize='none'
                value={formatDomainWithUrl(slug)}
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

export function checkGroupUrlThenRedirect (slug, fetchGroupExists, setErrorMessage, updateGroupData, goToNextStep) {
  return fetchGroupExists(slug)
    .then((data) => {
      const error = get('error', data)
      const groupExists = get('payload.data.groupExists.exists', data)
      if (error) {
        setErrorMessage('There was an error, please try again.')
        return
      }
      if (groupExists) {
        setErrorMessage('This url already exists. Please choose another one.')
        return
      }
      if (groupExists === false) {
        updateGroupData({ slug })
        goToNextStep()
        return
      }
      // if there is no error or groupExists variable, assume some other error
      setErrorMessage('There was an error, please try again.')
    }, () => {
      setErrorMessage('There was an error, please try again.')
    })
}
