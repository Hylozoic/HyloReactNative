import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { omit, pick, pickBy, identity } from 'lodash/fp'
import { validateUser } from 'hylo-utils/validators'
import useForm from 'hooks/useForm'
import {
  getLocalUserSettings,
  updateLocalUserSettings,
  signup,
  SIGNUP,
  defaultUserSettings
} from '../SignupFlow.store.js'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { UPDATE_USER_SETTINGS } from 'store/constants'
import updateUserSettings from 'store/actions/updateUserSettings'
import getMe from 'store/selectors/getMe'
import SettingControl from 'components/SettingControl'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import styles from './SignupFlow1.styles'

export default function SignupFlow1 ({ navigation, route }) {
  const currentUser = useSelector(getMe)
  const userSettingsFromStore = useSelector(getLocalUserSettings)
  const dispatch = useDispatch()

  const validator = ({ name, password, confirmPassword }) => {
    return pickBy(identity, {
      name: validateUser.name(name),
      password: !currentUser && validateUser.password(password),
      confirmPassword: !currentUser && password !== confirmPassword && 'Passwords must match'
    })
  }

  const saveAndNext = async () => {
    const filteredValues = pickBy(identity, values)
    const paramsFromState = omit(['password', 'confirmPassword'], filteredValues)
    const currentUserParams = pick(['name', 'email', 'avatarUrl', 'location'], filteredValues)
    const signupParams = pick(['name', 'email', 'password'], filteredValues)

    try {
      if (currentUser) {
        dispatch(updateLocalUserSettings(paramsFromState))
        await dispatch(updateUserSettings(currentUserParams))
      } else {
        await dispatch(signup(signupParams))
        dispatch(updateLocalUserSettings(paramsFromState))
        await dispatch(fetchCurrentUser())
      }
      navigation.navigate('SignupFlow2')
    } catch (error) {
      console.log('!!! error', error)
      return error
    }
  }

  const {
    values,
    errors,
    setValues,
    handleChange,
    handleSubmit
  } = useForm(saveAndNext, validator)
  const pending = useSelector(state =>
    state.pending[SIGNUP] || state.pending[UPDATE_USER_SETTINGS])
  const passwordControlRef = useRef()
  const confirmPasswordControlRef = useRef()
  const {
    name,
    email,
    password,
    confirmPassword
  } = values

  useEffect(() => {
    // this is for the case where they logged in but hadn't finished sign up    
    if (currentUser) {
      dispatch(updateLocalUserSettings({ name: currentUser.ref?.name }))
    } else {
      dispatch(updateLocalUserSettings(defaultUserSettings))
    }
    
    setValues({
      ...userSettingsFromStore,
      email: route.params?.email || userSettingsFromStore?.email
    })
  }, [])

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => { 
        if (currentUser) {
          dispatch(updateUserSettings({ settings: { signupInProgress: false } }))
        } else {
          dispatch(updateLocalUserSettings({ email: null }))
          navigation.navigate('Signup Intro', { email })
        }
      }
    })
  })

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>Let's do this!</Text>
          <Text style={styles.subTitle}>
            Hi <Text style={{ fontWeight: 'bold' }}>{email}</Text> we just need to know your name and password and you're account will be created.
          </Text>
        </View>
        <View style={styles.content}>
          <SettingControl
            label='Your Full Name'
            value={name}
            onChange={value => handleChange('name', value)}
            error={errors.name}
            returnKeyType='next'
            onSubmitEditing={() => passwordControlRef.current.focus()}
          />
          {!currentUser && (
            <SettingControl
              ref={passwordControlRef}
              label='Password'
              value={password}
              onChange={value => handleChange('password', value)}
              toggleSecureTextEntry
              error={errors.password}
              returnKeyType='next'
              onSubmitEditing={() => confirmPasswordControlRef.current.focus()}
            />
          )}
          {!currentUser && (
            <SettingControl
              ref={confirmPasswordControlRef}
              label='Confirm Password'
              value={confirmPassword}
              onChange={value => handleChange('confirmPassword', value)}
              toggleSecureTextEntry
              error={errors.confirmPassword}
              returnKeyType='go'
              onSubmitEditing={handleSubmit}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Button
          style={styles.continueButton}
          text={pending ? 'Saving...' : 'Continue'}
          onPress={handleSubmit}
          disabled={!!pending}
        />
      </View>
    </KeyboardFriendlyView>
  )
}
