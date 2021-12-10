import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { any, values } from 'lodash/fp'
import { validateUser } from 'hylo-utils/validators'
import SettingControl from 'components/SettingControl'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import styles from './SignupFlow1.styles'

export default function SignupFlow1 ({
  currentUser, loadUserSettings, errors: errorsFromStore,
  name, email, password, confirmPassword, pending,
  showPasswordField, signupOrUpdate, changeSetting
}) {  
  const passwordControlRef = useRef()
  const confirmPasswordControlRef = useRef()
  const [errors, setErrors] = useState({
    name: null,
    password: null,
    ...errorsFromStore
  })
  const validate = () => {
    setErrors({
      name: validateUser.name(name),
      password: showPasswordField && validateUser.password(password),
      confirmPassword: password !== confirmPassword && 'Passwords must match'
    })

    return !any(i => i, values(errors))
  }
  const submit = () => {
    if (pending) return
    if (validate()) {
      signupOrUpdate()
    }
  }
  const updateField = (field, value) => {
    setErrors({
      ...errors,
      [field]: null
    })
    changeSetting(field, value)
  }

  // this is for the case where they logged in but hadn't finished sign up
  useEffect(() => {
    if (currentUser) loadUserSettings()
  }, [])
    
  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>One more step!</Text>
          <Text style={styles.subTitle}>
            Hi <Text style={{ fontWeight: 'bold' }}>{email}</Text> we just need to know your name and password and you're in.
          </Text>
        </View>
        <View style={styles.content}>
          <SettingControl
            label='Your Full Name'
            value={name}
            onChange={value => updateField('name', value)}
            error={errors.name}
            returnKeyType='next'
            onSubmitEditing={() => passwordControlRef.current.focus()}
          />
          {showPasswordField && (
            <SettingControl
              ref={passwordControlRef}
              label='Password'
              value={password}
              onChange={value => updateField('password', value)}
              toggleSecureTextEntry
              error={errors.password}
              returnKeyType='next'
              onSubmitEditing={() => confirmPasswordControlRef.current.focus()}
            />
          )}
          {showPasswordField && (
            <SettingControl
              ref={confirmPasswordControlRef}
              label='Confirm Password'
              value={confirmPassword}
              onChange={value => updateField('confirmPassword', value)}
              toggleSecureTextEntry
              error={errors.confirmPassword}
              returnKeyType='go'
              onSubmitEditing={submit}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Button
          style={styles.continueButton}
          text={pending ? 'Saving...' : 'Continue'}
          onPress={submit}
          disabled={!!pending}
        />
      </View>
    </KeyboardFriendlyView>
  )
}
