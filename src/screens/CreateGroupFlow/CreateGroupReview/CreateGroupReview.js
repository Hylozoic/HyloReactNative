import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import styles from '../CreateGroupFlow.styles'
import SafeAreaView from 'react-native-safe-area-view'
import ErrorBubble from 'components/ErrorBubble'

import {
  createGroup,
  clearCreateGroupStore,
  CREATE_GROUP
} from '../CreateGroupFlow.store'


export default function CreateGroupReview ({
  createGroup, clearCreateGroupStore, groupData,
  goToCreateGroupUrl, goToCreateGroupName, createGroupPending
}) {
  const [error, setError] = useState(null)

  const submit = () => {
    return createGroup(groupData)
      .then((data) => {
        if (data.error) {
          setError('There was an error, please try again.')
          return
        }
        clearCreateGroupStore()
        goToGroup(data.payload.data.createGroup.group)
      })
      .catch(() => {
        setError('There was an error, please try again.')
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView>
        <View style={styles.header}>
          <Text style={styles.heading}>Everything look good?</Text>
          <Text style={styles.description}>You can always come back and change your details at any time</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>What's the name of your group?</Text>
            <View style={styles.textInputWithButton}>
              <TextInput
                style={styles.textInput}
                value={groupData.name}
                underlineColorAndroid={styles.androidInvisibleUnderline}
                disabled
              />
              <TouchableOpacity onPress={goToCreateGroupName} style={styles.editContainer}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>What's the URL of your group?</Text>
            <View style={styles.textInputWithButton}>
              <TextInput
                style={styles.textInput}
                value={groupData.url}
                underlineColorAndroid={styles.androidInvisibleUnderline}
                disabled
              />
              <TouchableOpacity onPress={goToCreateGroupUrl} style={styles.editContainer}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {error && <View style={styles.errorBubble}><ErrorBubble text={error} /></View>}
        <View style={styles.footer}>
          <Button
            text="Let's Do This!"
            onPress={submit}
            style={styles.button}
            disabled={!!createGroupPending}
          />
        </View>
      </KeyboardFriendlyView>
    </SafeAreaView>
  )
}
