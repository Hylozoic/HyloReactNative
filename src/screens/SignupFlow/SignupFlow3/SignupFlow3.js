import React, { useEffect, useRef } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import useCurrentLocation from 'hooks/useCurrentLocation'
import { defaultUserSettings, getLocalUserSettings, updateLocalUserSettings } from '../SignupFlow.store.js'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import SettingControl from 'components/SettingControl'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
import styles from './SignupFlow3.styles'

export default function SignupFlow3 ({ navigation }) {
  const dispatch = useDispatch()
  const { location } = useSelector(getLocalUserSettings)
  const controlRef = useRef()
  const currentUser = useSelector(getMe)
  const [currentLocation, getLocation] = useCurrentLocation()

  useEffect(() => {
    // this is for the case where they logged in but hadn't finished sign up
    currentUser && !location && dispatch(updateLocalUserSettings({ location: currentUser.ref?.location }))
    getLocation()
  }, [])

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => finish()
    })
  })

  const finish = () => {
    controlRef.current && controlRef.current.blur()
    dispatch(updateLocalUserSettings(defaultUserSettings))
    dispatch(updateUserSettings({ settings: { signupInProgress: false } }))
  }

  const showLocationPicker = locationText  => {
    LocationPicker({
      navigation,
      currentLocation,
      initialSearchTerm: locationText,
      onPick: location => {
        dispatch(updateLocalUserSettings({ location: location?.fullText }))
        dispatch(updateLocalUserSettings({ locationId: location?.id }))
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
          text='Finish'
          onPress={finish}
        />
      </View>
    </KeyboardFriendlyView>
  )
}
