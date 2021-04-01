import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View, TextInput } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { get } from 'lodash/fp'
import ErrorBubble from 'components/ErrorBubble'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import isPendingFor from 'store/selectors/isPendingFor'
import {
  slugValidatorRegex, invalidSlugMessage,
  formatDomainWithUrl, removeDomainFromURL
} from './util'
import { updateGroupData, fetchGroupExists, getGroupData } from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupUrl ({ navigation }) {
  const nextScreen = 'CreateGroupVisibilityAccessibility'
  const dispatch = useDispatch()
  const fetchUrlPending = useSelector(state => isPendingFor(fetchGroupExists, state))

  const groupData = useSelector(getGroupData)
  const [error, setError] = useState()
  const [groupSlug, providedSetGroupSlug] = useState(groupData.slug)

  const setGroupSlug = slug => {
    setError()
    return providedSetGroupSlug(slug)
  }

  const checkAndSubmit = async () => {
    if (!groupSlug || groupSlug.length === 0) {
      setError('Please enter a URL')
      return
    }
    if (!slugValidatorRegex.test(groupSlug)) {
      setError(invalidSlugMessage)
      return
    }

    return checkGroupUrlThenRedirect(groupSlug,
      params => dispatch(fetchGroupExists(params)),
      setError,
      params => dispatch(updateGroupData(params)),
      () => navigation.navigate(nextScreen)
    )
  }

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
              onChangeText={slug => setGroupSlug(removeDomainFromURL(slug))}
              returnKeyType='next'
              autoCapitalize='none'
              value={formatDomainWithUrl(groupSlug)}
              autoCorrect={false}
              underlineColorAndroid={styles.androidInvisibleUnderline}
            />
          </View>
          {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
        </View>
        <View style={styles.footer}>
          <Button text='Continue' onPress={checkAndSubmit} style={styles.button} disabled={!!fetchUrlPending} />
        </View>
      </KeyboardFriendlyView>
    </SafeAreaView>
  )
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
        setErrorMessage('This URL already exists. Please choose another one.')
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
