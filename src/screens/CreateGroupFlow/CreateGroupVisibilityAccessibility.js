import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import { Picker } from '@react-native-picker/picker'
import {
  GROUP_ACCESSIBILITY, GROUP_VISIBILITY,
  visibilityDescription, accessibilityDescription
} from 'store/models/Group'
import { white } from 'style/colors'
import { getGroupData, updateGroupData } from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'

export default function CreateGroupVisibilityAccessibility ({ navigation }) {
  const nextScreen = 'CreateGroupParentGroups'
  const groupData = useSelector(getGroupData)
  const dispatch = useDispatch()
  const [visibility, setVisibility] = useState(groupData.visibility)
  const [accessibility, setAccessibility] = useState(groupData.accessibility)

  const checkAndSubmit = () => {
    dispatch(updateGroupData({ visibility, accessibility }))
    navigation.navigate(nextScreen)
  }

  /*
    HOLONIC TODO: The picker component I found for this doesn't seem to allow wrapping
                  which is making it a bad fit. We probably need a different picker.

                  This may be the best alternative:

                  https://github.com/lawnstarter/react-native-picker-select

  */
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* <View style={styles.header}> */}
          <Text style={styles.heading}>Visibility and Accessibility</Text>
          {/* HOLONIC TODO: Write a description here of visibility and accessibility? */}
          {/* <Text style={styles.description}>...</Text> */}
        {/* </View> */}
        <View style={styles.content}>
          <View style={stepStyles.pickerContainer}>
            <Text style={stepStyles.pickerLabel}>Who can see this group?</Text>
            {/* HOLONIC TODO: Wrap text in picker (doesn't seem possible), or use a different picker? */}
            <Picker style={stepStyles.picker} itemStyle={stepStyles.pickerItem} selectedValue={visibility} onValueChange={setVisibility}>
              {Object.values(GROUP_VISIBILITY).map(visibilityValue => (
                <Picker.Item label={visibilityDescription(visibilityValue)}
                  value={visibilityValue} key={visibilityValue} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={stepStyles.pickerLabel}>Who can join this group?</Text>
            {/* HOLONIC TODO: Wrap text in picker (doesn't seem possible), or use a different picker? */}
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
      </View>
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
    borderRadius: 15,
    // flexWrap: 'wrap'
  },
  pickerItem: {
    fontSize: 14,
    height: 130
  },
}

