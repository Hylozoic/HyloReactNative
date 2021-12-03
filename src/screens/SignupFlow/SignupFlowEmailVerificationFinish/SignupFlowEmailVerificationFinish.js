import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import {
  getEmailToVerify,
  clearEmailToVerify,
  verifyEmail
} from 'screens/SignupFlow/SignupFlow.store'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import Triangle from 'react-native-triangle'
import styles from './SignupFlowEmailVerificationFinish.styles'
import controlStyles from 'components/SettingControl/SettingControl.styles'

const CODE_LENGTH = 6

export default function SignupFlowEmailVerificationFinish ({ navigation, route }) {
  const dispatch = useDispatch()
  const [pending, setPending] = useState()
  const [verificationCode, setVerificationCode] = useState()
  const [error, setError] = useState()
  const verificationCodeRef = useBlurOnFulfill({
    value: verificationCode,
    cellCount: CODE_LENGTH
  })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode
  })
  const email = route.params?.email || useSelector(getEmailToVerify)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => { 
        dispatch(clearEmailToVerify())
        navigation.navigate('Signup - Email Verification', { email })
      }
    })
  })

  const submit = async () => {
    try {
      setPending(true)
      await dispatch(verifyEmail(email, verificationCode))
      await dispatch(clearEmailToVerify())
      navigation.navigate('SignupFlow1')
    } catch (e) {
      setError('Expired or invalid code')
    } finally {
      setPending(false)
    }
  }

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>
            Check your email
          </Text>
          <Text style={styles.subTitle}>
            We've sent a 6 digit code to EMAIL. The code will expire shortly, so please enter it here soon.
          </Text>
        </View>
        <View style={styles.content}>
        <CodeField
          ref={verificationCodeRef}
          {...props}
          value={verificationCode}
          onChangeText={setVerificationCode}
          cellCount={CODE_LENGTH}
          rootStyle={styles.codeFieldRoot}
          keyboardType='number-pad'
          textContentType='oneTimeCode'
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.codeFieldCell, isFocused && styles.codeFieldCellFocused]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : <Text> </Text>)}
            </Text>
          )}
        />
        </View>
        {!!error && (
          <View style={[controlStyles.errorWrapper]}>
            <Triangle width={10} height={5} color='white' direction='up' />
            <View style={[controlStyles.error]}>
              <Text style={controlStyles.errorText}>{error}</Text>
            </View>
          </View>
        )}
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
