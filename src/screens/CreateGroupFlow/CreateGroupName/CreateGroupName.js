import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View, TextInput } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { getGroupData, updateGroupData } from '../CreateGroupFlow.store'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ErrorBubble from 'components/ErrorBubble'
import styles from '../CreateGroupFlow.styles'

export default function CreateGroupName ({ navigation }) {
  const dispatch = useDispatch()
  const groupData = useSelector(getGroupData)

  const [error, setError] = useState()
  const [groupName, providedSetGroupName] = useState(groupData.name)

  const setGroupName = name => {
    setError()
    return providedSetGroupName(name)
  }

  const checkAndSubmit = () => {
    if (!groupName || groupName.length === 0) {
      setError('Please enter a group name')
      return
    }
    dispatch(updateGroupData({ name: groupName }))
    navigation.navigate('CreateGroupUrl')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView>
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
              underlineColorAndroid={styles.androidInvisibleUnderline}
            />
          </View>
          {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>}
        </View>
        <View style={styles.footer}>
          <Button text='Continue' onPress={checkAndSubmit} style={styles.button} />
        </View>
      </KeyboardFriendlyView>
    </SafeAreaView>
  )
}
