import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, View, Text } from 'react-native'
import validator from 'validator'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SettingControl from 'components/SettingControl'
import Button from 'components/Button'
import styles from './SignupFlowEmailVerification.styles'
import { getEmailToVerify, sendEmailVerification } from 'screens/SignupFlow/SignupFlow.store'

export default function SignupFlowEmailVerification ({ navigation, route }) {
  const emailToVerify = useSelector(getEmailToVerify) || route.params?.email
  const dispatch = useDispatch()
  const [pending, setPending] = useState()
  const [email, setEmail] = useState(emailToVerify)
  const [error, setError] = useState()
  const submit = async () => {
    setPending(true)
    if (validator.isEmail(email)) {
      await dispatch(sendEmailVerification(email))
      navigation.navigate('Signup - Email Verification - Finish', { email })
    } else {
      setError('Must be a valid email')
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
