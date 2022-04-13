import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import useCurrentLocation from 'hooks/useCurrentLocation'
import getMe from 'store/selectors/getMe'
import checkLogin from 'store/actions/checkLogin'
import updateUserSettings from 'store/actions/updateUserSettings'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import SettingControl from 'components/SettingControl'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
import styles from './SignupSetLocation.styles'

export default function SignupSetLocation ({ navigation }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const [location, setLocation] = useState(currentUser?.location)
  const [locationId, setLocationId] = useState(currentUser?.locationId)
  const [currentLocation, getLocation] = useCurrentLocation()
  const controlRef = useRef()

  useEffect(() => { getLocation() }, [])

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => {
        // onCancel: This will have the effect of fully Authorizing the user
        // and they will be forwarded to `AuthRoot`
        dispatch(updateUserSettings({ settings: { signupInProgress: false } }))
      }
    })
  })

  const finish = async () => {
    controlRef.current && controlRef.current.blur()
    await dispatch(updateUserSettings({ location, locationId, settings: { signupInProgress: false } }))
    await dispatch(checkLogin())
  }

  const showLocationPicker = locationText => {
    LocationPicker({
      navigation,
      currentLocation,
      initialSearchTerm: locationText,
      onPick: pickedLocation => {
        setLocation(pickedLocation?.fullText)
        setLocationId(pickedLocation?.id)
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