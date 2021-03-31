import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import styles from '../CreateGroupFlow.styles'
import { Picker } from '@react-native-picker/picker'
import {
  GROUP_ACCESSIBILITY, GROUP_VISIBILITY,
  visibilityDescription, accessibilityDescription
} from 'store/models/Group'
import { updateGroupData } from '../CreateGroupFlow.store'
import { white } from 'style/colors'

export default function CreateGroupVisibilityAccessibility ({ navigation }) {
  const dispatch = useDispatch()
  const [visibility, setVisibility] = useState(GROUP_VISIBILITY.Hidden)
  const [accessibility, setAccessibility] = useState(GROUP_ACCESSIBILITY.Closed)

  const checkAndSubmit = () => {
    dispatch(updateGroupData({ visibility, accessibility }))
    navigation.navigate('CreateGroupParentGroups')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView>
        {/* <View style={styles.header}> */}
          <Text style={styles.heading}>Visibility and Accessibility</Text>
          {/* HOLONIC TODO: Write a description here of visibility and accessibility? */}
          {/* <Text style={styles.description}>...</Text> */}
        {/* </View> */}
        <View style={styles.content}>
          <View style={stepStyles.pickerContainer}>
            <Text style={stepStyles.pickerLabel}>Who can see this group?</Text>
            <Picker style={stepStyles.picker} itemStyle={stepStyles.pickerItem} selectedValue={visibility} onValueChange={setVisibility}>
              {Object.values(GROUP_VISIBILITY).map(visibilityValue => (
                <Picker.Item label={visibilityDescription(visibilityValue)}
                  value={visibilityValue} key={visibilityValue} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={stepStyles.pickerLabel}>Who can join this group?</Text>
            <Picker style={stepStyles.picker} itemStyle={stepStyles.pickerItem} selectedValue={accessibility} onValueChange={value => setAccessibility(value)}>
              {Object.values(GROUP_ACCESSIBILITY).map(accessibilityValue => (
                <Picker.Item label={accessibilityDescription(accessibilityValue)}
                  value={accessibilityValue} key={accessibilityValue} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.footer}>
          <Button text='Continue' onPress={checkAndSubmit} style={styles.button} />
        </View>
      </KeyboardFriendlyView>
    </SafeAreaView>
  )
}

const stepStyles = {
  pickerContainer: {
    marginBottom: 50
  },
  pickerLabel: {
    fontSize: 16,
    color: white,
    fontWeight: 'bold',
    marginBottom: 10
  },
  picker: {
    minWidth: '90%',
    backgroundColor: white,
    borderRadius: 15
  },
  pickerItem: {
    fontSize: 14,
    height: 130
  },
}

