import React, { useRef } from 'react'
import { ScrollView, View, Text } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import SettingControl from 'components/SettingControl'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
import styles from './SignupFlow3.styles'

export default function SignupFlow3 ({
  location, saveAndNext: providedSaveAndNext, navigation, changeSetting
}) {
  const controlRef = useRef()

  const saveAndNext = () => {
    controlRef.current && controlRef.current.blur()
    providedSaveAndNext()
  }

  const showLocationPicker = locationText  => {
    LocationPicker({
      navigation,
      initialSearchTerm: locationText,
      onPick: location => {
        changeSetting('location')(location?.fullText)
        changeSetting('locationId')(location?.id)
      }
    })
  }
  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>Add your location</Text>
          <Text style={styles.subTitle}>
            Add your location to see more relevant content and find people and projects near you.
          </Text>
        </View>
        <View style={styles.content}>
          <SettingControl
            ref={controlRef}
            label='Where do you call home'
            value={location}
            onFocus={() => showLocationPicker(location)}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
      <Button
          style={styles.backButton}
          text='< Back'
          onPress={() => navigation.goBack()}
        />
        <Button
          style={styles.continueButton}
          text='Continue'
          onPress={saveAndNext}
        />
      </View>
    </KeyboardFriendlyView>
  )
}
