import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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
import { saveGroupVisibilityAccessibility } from '../CreateGroupFlow.store'

export default function CreateGroupVisibilityAccessibility ({
  navigation
}) {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState([])
  const [visibility, setVisibility] = useState('')
  const [accessibility, setAccessibility] = useState('')

  const checkAndSubmit = () => {
    setErrors([])
    console.log('!!! visibility, accessibility:', visibility, accessibility)
    dispatch(saveGroupVisibilityAccessibility([visibility, accessibility]))
    navigation.navigate('CreateGroupReview')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView>
        <View style={styles.header}>
          <Text style={styles.heading}>Visibility and Accessibility</Text>
          {/* HOLONIC TODO: Write a description here of visibility and accessibility? */}
          {/* <Text style={styles.description}>...</Text> */}
        </View>
        <View style={styles.content}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Who can see this group?</Text>
            <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={visibility} onValueChange={setVisibility}>
              {Object.values(GROUP_VISIBILITY).map(visibilityValue => (
                <Picker.Item label={visibilityDescription(visibilityValue)}
                  value={visibilityValue} key={visibilityValue} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Who can join this group?</Text>
            <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={accessibility} onValueChange={value => setAccessibility(value)}>
              {Object.values(GROUP_ACCESSIBILITY).map(accessibilityValue => (
                <Picker.Item label={accessibilityDescription(accessibilityValue)}
                  value={accessibilityValue} key={accessibilityValue} />
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
