import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { Text, View, ScrollView, TextInput } from 'react-native'
import getRouteParam from 'store/selectors/getRouteParam'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import {
  getGroupData, getEdited, updateGroupData, setWorkflowOptions,
  clearCreateGroupStore
} from './CreateGroupFlow.store'
import ErrorBubble from 'components/ErrorBubble'
import styles from './CreateGroupFlow.styles'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'

export default function CreateGroupPurpose ({ route }) {
  const dispatch = useDispatch()
  // Add current group in as pre-selected as a parent group for Parent Groups Step
  const edited = useSelector(getEdited)
  const currentGroup = useSelector(getCurrentGroup)
  const groupData = useSelector(getGroupData)
  const [groupPurpose, setGroupPurpose] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const reset = getRouteParam('reset', route)
    if (reset) {
      dispatch(clearCreateGroupStore())
      setGroupPurpose('')
    } else {
      setGroupPurpose(groupData?.purpose)
    }
  }, [])

  useFocusEffect(useCallback(() => {
    dispatch(updateGroupData({ purpose: groupPurpose }))
    setError()
    dispatch(setWorkflowOptions({ disableContinue: false }))
  }, [groupPurpose]))

  useFocusEffect(useCallback(() => {
    if (!edited && ![ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(currentGroup?.id)) {
      dispatch(updateGroupData({ parentIds: [currentGroup?.id] }))
    }
  }, [edited, currentGroup?.id]))

  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.heading}>Group Purpose</Text>
          <Text style={styles.description}>Your purpose statement is a concise summary of why your group exists and what you hope to accomplish. A clear and specific purpose helps align members of your group to coordinate effectively to achieve your goals.</Text>
          <Text style={styles.description}>Aim for one or two sentences.</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>What's the purpose of the group?</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setGroupPurpose}
              returnKeyType='next'
              autoCapitalize='none'
              value={groupPurpose}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              maxLength={500}
              multiline
            />
          </View>
          {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
        </View>
      </ScrollView>
    </View>
  )
}
