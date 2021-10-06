import React, { useCallback, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View, ScrollView, TextInput } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { debounce } from 'lodash/fp'
import ErrorBubble from 'components/ErrorBubble'
import {
  slugValidatorRegex, invalidSlugMessage,
  formatDomainWithUrl, removeDomainFromURL
} from './util'
import {
  updateGroupData, setWorkflowOptions,
  fetchGroupExists, getGroupData
} from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupUrl ({ navigation }) {
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)
  const [error, providedSetError] = useState()
  const [groupSlug, setGroupSlug] = useState(groupData?.slug)
  const setError = error => {
    dispatch(setWorkflowOptions({ disableContinue: true }))
    providedSetError(error)
  }
  const clearError = () => providedSetError()

  const validateAndSave = useMemo(() => debounce(300, async (slug) => {
    try {
      if (!slug || slug.length === 0) {
        // setError('Please enter a URL')
        dispatch(setWorkflowOptions({ disableContinue: true }))
        return false
      }
  
      if (!slugValidatorRegex.test(slug)) {
        setError(invalidSlugMessage)
        return false
      }

      const data = await dispatch(fetchGroupExists(slug))
      const error = data?.error
      const groupExists = data?.payload?.data?.groupExists?.exists

      if (error) {
        setError('There was an error, please try again.')
      } else if (groupExists === false) {
        dispatch(updateGroupData({ slug }))
        clearError()
        dispatch(setWorkflowOptions({ disableContinue: false }))
      } else if (groupExists) {
        setError('This URL already exists. Please choose another one.')
      } else {
        // if there is no error or groupExists variable, assume some other error
        setError('There was an error, please try again.')
      }
    } catch (error) {
      setError('There was an error, please try again.')
    }
  }), [])

  useFocusEffect(useCallback(() => {
    dispatch(setWorkflowOptions({ disableContinue: true }))
    validateAndSave(groupSlug)
  }, [groupSlug]))

  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
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
              underlineColorAndroid='transparent'
            />
          </View>
          {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
        </View>
      </ScrollView>
    </View>
  )
}
