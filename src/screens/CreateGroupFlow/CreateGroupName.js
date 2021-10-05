import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { Text, View, ScrollView, TextInput } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ErrorBubble from 'components/ErrorBubble'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import {
  getGroupData, getEdited, updateGroupData, setWorkflowOptions,
  clearCreateGroupStore
} from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'
import { ALL_GROUP_ID } from 'store/models/Group'
import getRouteParam from 'store/selectors/getRouteParam'

export default function CreateGroupName ({ navigation, route }) {
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)
  const [groupName, setGroupName] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const reset = getRouteParam('reset', route)
    if (reset) {
      dispatch(clearCreateGroupStore())
      setGroupName('')
    } else {
      setGroupName(groupData?.name)
    }
  }, [])
  
  useFocusEffect(useCallback(() => {
    if (!groupName || groupName.length === 0) {
      dispatch(setWorkflowOptions({ disableContinue: true }))
    } else {
      dispatch(updateGroupData({ name: groupName }))
      setError()
      dispatch(setWorkflowOptions({ disableContinue: false }))
    }
  }, [groupName]))

  // Add current group in as pre-selected as a parent group for Parent Groups Step
  const edited = useSelector(getEdited)
  const currentGroupId = useSelector(getCurrentGroupId)

  useFocusEffect(useCallback(() => {
    if (!edited && currentGroupId !== ALL_GROUP_ID) {
      dispatch(updateGroupData({ parentIds: [currentGroupId] }))
    }
  }, [edited, currentGroupId]))

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.heading}>Let's get started!</Text>
          <Text style={styles.description}>All good things start somewhere! Let's kick things off with a catchy name for your group.</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>What's the name of your group?</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setGroupName}
              returnKeyType='next'
              autoCapitalize='none'
              value={groupName}
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
