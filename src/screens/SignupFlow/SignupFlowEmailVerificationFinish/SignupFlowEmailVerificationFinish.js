import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import validator from 'validator'
import { any, values } from 'lodash/fp'
import styles from './SignupFlowEmailVerificationFinish.styles'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import getEmailToVerify from 'store/selectors/getEmailToVerify'
import verifyEmail from 'store/actions/verifyEmail'

const CODE_LENGTH = 6

export default function SignupFlowEmailVerificationFinish ({ navigation }) {
  const dispatch = useDispatch()
  const emailToVerify = useSelector(getEmailToVerify)
  const [pending, setPending] = useState()
  const [verificationCode, setVerificationCode] = useState()
  const [error, setError] = useState()
  // TODO: Seperate out code entry field as it's own component?
  const verificationCodeRef = useBlurOnFulfill({
    value: verificationCode,
    cellCount: CODE_LENGTH
  })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode
  })
  const validate = () => {
    setError('Invalid code')
    // setError(!validator.isEmail(email) && 'Must be a valid email')
    return !any(i => i, values(error))
  }
  const submit = async () => {
    try {
      console.log('!!! emailToVerify, verificationCodeBegin:', emailToVerify, verificationCode)
      setPending(true)
      await dispatch(verifyEmail(emailToVerify, verificationCode))
      navigation.navigate('SignupFlow1')
    } catch (e) {
      setError(e || 'Expired or invalid code')
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
