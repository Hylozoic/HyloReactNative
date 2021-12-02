import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import validator from 'validator'
import styles from './SignupFlowEmailVerificationFinish.styles'
import controlStyles from 'components/SettingControl/SettingControl.styles'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import getEmailToVerify from 'store/selectors/getEmailToVerify'
import verifyEmail from 'store/actions/verifyEmail'
import Triangle from 'react-native-triangle'
import { useFocusEffect } from '@react-navigation/core'
import clearEmailToVerify from 'store/actions/clearEmailToVerify'

const CODE_LENGTH = 6

export default function SignupFlowEmailVerificationFinish ({ navigation, route }) {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(true)
  const [email, setEmail] = useState()
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
  const submit = async () => {
    try {
      setPending(true)
      await dispatch(verifyEmail(email, verificationCode))
      await clearEmailToVerify()
      navigation.navigate('SignupFlow1')
    } catch (e) {
      setError('Expired or invalid code')
    } finally {
      setPending(false)
    }
  }
  useFocusEffect(() => {
    if (route.params?.email) {
      setEmail(route.params?.email)
      setPending(false)
    } else {
      const asyncFunc = async () => {
        setEmail(await getEmailToVerify())
        setPending(false)
      }
      asyncFunc()
    }
  })
  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => { 
        clearEmailToVerify()
        navigation.navigate('Signup - Email Verification')
      }
    })
  })

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
