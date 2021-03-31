import React, { useState } from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ErrorBubble from 'components/ErrorBubble'
import styles from '../CreateGroupFlow.styles'
import { Picker } from '@react-native-picker/picker'
import {
  GROUP_ACCESSIBILITY, GROUP_VISIBILITY,
  visibilityDescription, accessibilityDescription
} from 'store/models/Group'
// import { saveGroupName, getGroupName } from '../CreateGroupFlow.store'

export default function CreateGroupVisibilityAccessibility ({
  // accessibility, visibility
}) {
  const [errors, setErrors] = useState([])
  const [visibility, setVisibility] = useState('')
  const [accessibility, setAccessibility] = useState('')

  const checkAndSubmit = () => {
    const { groupName } = this.state

    setErrors([])

    if (!groupName || groupName.length === 0) {
      setErrors(['Please enter a group name'])
    } else {
      console.log('!!! visibility, accessibility:', visibility, accessibility)
      // HOLONIC TODO: save into CreateGroupFlow store, go to next step
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView>
        <View style={styles.header}>
          <Text style={styles.heading}>Visibility and Accessibility</Text>
          <Text style={styles.description}>...</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Who can see this group?</Text>
            <Picker selectedValue={visibility} onValueChange={setVisibility}>
              {Object.keys(GROUP_VISIBILITY).map(visibilityKey => (
                <Picker.Item label={visibilityDescription(visibilityKey)} value={GROUP_VISIBILITY[visibilityKey]} />
              ))}              
            </Picker>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Who can join this group?</Text>
            <Picker selectedValue={accessibility} onValueChange={setAccessibility}>
              {Object.keys(GROUP_ACCESSIBILITY).map(accessibilityKey => (
                <Picker.Item label={accessibilityDescription(accessibilityKey)} value={GROUP_ACCESSIBILITY[accessibilityKey]} />
              ))}              
            </Picker>
          </View>
          {/* {error && <View style={styles.errorBubble}><ErrorBubble text={error} topArrow /></View>} */}
        </View>
        <View style={styles.footer}>
          <Button text='Continue' onPress={checkAndSubmit} style={styles.button} />
        </View>
      </KeyboardFriendlyView>
    </SafeAreaView>
  )
}
