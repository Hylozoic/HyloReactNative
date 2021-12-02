import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import SettingControl from 'components/SettingControl'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import validator from 'validator'
import { any, values } from 'lodash/fp'
import styles from './SignupFlowEmailVerification.styles'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import { sendEmailVerification } from 'store/actions/sendEmailVerification'
import setEmailToVerify from 'store/actions/setEmailToVerify'

export default function SignupFlowEmailVerification ({ navigation }) {
  const dispatch = useDispatch()
  const emailControlRef = useRef()
  const [pending, setPending] = useState()
  const [email, setEmail] = useState()
  const [error, setError] = useState()
  const valid = () => {
    if (validator.isEmail(email)) {
      return true
    } else {
      setError('Must be a valid email')
      return false
    }
  }
  const submit = async () => {
    setPending(true)
    if (valid()) {
      await dispatch(sendEmailVerification(email))
      await setEmailToVerify(email)
      navigation.navigate('Signup - Email Verification - Finish', { email })
    }
    setPending(false)
  }

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Hylo</Text>
          <Text style={styles.subTitle}>Stay connected, organized, and engaged with your group.</Text>
        </View>
        <View style={styles.content}>
          <SettingControl
            ref={emailControlRef}
            label='Enter your email to get started'
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            onChange={value => setEmail(value)}
            error={error}
            returnKeyType='next'
          />
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
