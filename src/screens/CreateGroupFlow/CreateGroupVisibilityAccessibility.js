import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import RoundCheckbox from 'components/RoundCheckBox'
import Icon from 'components/Icon'
import {
  GROUP_ACCESSIBILITY, GROUP_VISIBILITY,
  visibilityDescription, accessibilityDescription,
  visibilityIcon, accessibilityIcon
} from 'store/models/Group'
import { caribbeanGreen, white20onCaribbeanGreen, black10OnCaribbeanGreen, white } from 'style/colors'
import { getGroupData, updateGroupData } from './CreateGroupFlow.store'
import styles from './CreateGroupFlow.styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'

export default function CreateGroupVisibilityAccessibility ({ navigation }) {
  const nextScreen = 'CreateGroupParentGroups'
  const groupData = useSelector(getGroupData)
  const dispatch = useDispatch()
  const [visibility, setVisibility] = useState(groupData.visibility)
  const [accessibility, setAccessibility] = useState(groupData.accessibility)

  const groupVisibilityOptions = Object.keys(GROUP_VISIBILITY).map(label => ({
    label: label + ': ' + visibilityDescription(GROUP_VISIBILITY[label]),
    iconName: visibilityIcon(GROUP_VISIBILITY[label]),
    value: GROUP_VISIBILITY[label]
  }))
  const groupAccessibilityOptions = Object.keys(GROUP_ACCESSIBILITY).map(label => ({
    label: label + ': ' + accessibilityDescription(GROUP_ACCESSIBILITY[label]),
    iconName: accessibilityIcon(GROUP_ACCESSIBILITY[label]),
    value: GROUP_ACCESSIBILITY[label]
  }))

  const checkAndSubmit = () => {
    dispatch(updateGroupData({ visibility, accessibility }))
    navigation.navigate(nextScreen)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardFriendlyView style={{ flex: 1 }}>
        {/* <View style={styles.header}>
          <Text style={styles.heading}>Visibility and Accessibility</Text>
        </View> */}
        <View style={styles.content}>
          <View style={stepStyles.optionsContainer}>
            <Text style={stepStyles.optionsLabel}>Who can see this group?</Text>
            {groupVisibilityOptions.map(option => (
              <Option option={option} chosen={option.value === visibility}
                onPress={setVisibility} key={option.value} />
            ))}
          </View>
          <View style={styles.optionsContainer}>
            <Text style={stepStyles.optionsLabel}>Who can join this group?</Text>
            {groupAccessibilityOptions.map(option => (
              <Option option={option} chosen={option.value === accessibility}
                onPress={setAccessibility} key={option.value} />
            ))}
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
  optionsContainer: {
    marginBottom: 24
  },
  optionsLabel: {
    fontSize: 20,
    color: white,
    fontWeight: 'bold',
    marginBottom: 10
  },
}

export function Option ({ option, chosen, onPress }) {
  return (
    <TouchableOpacity style={optionStyles.optionRow} onPress={() => onPress(option.value)}>
      <RoundCheckbox style={optionStyles.optionCheckbox}
        size={24}
        // icon={'checkmark-outline'}
        checked={chosen}
        iconColor={white20onCaribbeanGreen}
        borderColor={white}
        backgroundColor={white}
        onValueChange={() => onPress(option.value)} />
      <Icon style={optionStyles.optionIcon} name={option.iconName} />
      <Text style={optionStyles.optionsLabel}>{option.label}</Text>
    </TouchableOpacity>
  )
}

const optionStyles = {
  optionRow: {
    padding: 15,
    paddingBottom: 0,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  optionCheckbox: {
    marginTop: 10,
    color: caribbeanGreen,
  },
  optionIcon: {
    marginLeft: 10,
    fontSize: 20,
    color: white
  },
  optionsLabel: {
    // HOLONIC TODO: Confirm formatting in Android
    marginTop: -4,
    marginLeft: 10,
    fontFamily: 'Circular-Bold',
    flex: 1,
    fontSize: 16,
    color: white,
  }
}
