import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { useDispatch } from 'react-redux'
import {
  CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell
} from 'react-native-confirmation-code-field'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import errorMessages from 'util/errorMessages'
import verifyEmail from 'store/actions/verifyEmail'
import sendEmailVerification from 'store/actions/sendEmailVerification'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Loading from 'components/Loading'
import FormattedError from 'components/FormattedError'
import controlStyles from 'components/SettingControl/SettingControl.styles'
import styles from './SignupEmailValidation.styles'
import { SafeAreaView } from 'react-native-safe-area-context'

const CODE_LENGTH = 6

export default function SignupEmailValidation ({ navigation, route }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState()
  const [verificationCode, setVerificationCode] = useState()
  const [error, setError] = useState()

  const email = route.params?.email
  const token = route.params?.token

  const verificationCodeRef = useBlurOnFulfill({
    value: verificationCode,
    cellCount: CODE_LENGTH
  })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode
  })

  const resendCode = async () => {
    try {
      setLoading(true)

      await dispatch(sendEmailVerification(email))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    try {
      setLoading(true)

      const response = await dispatch(verifyEmail(email, verificationCode, token))
      const { error: responseError = null } = response.payload.getData()

      if (responseError) {
        if (responseError === 'invalid-link') {
          navigation.navigate('Signup Intro', { bannerError: errorMessages(responseError) })
          return
        }
        setError(responseError)
      }
    } catch (e) {
      setError('Expired or invalid code')
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!email) navigation.navigate('Signup')

      navigation.setOptions({
        headerLeftOnPress: () => {
          navigation.navigate('Signup Intro', { email })
        }
      })
    }, [email])
  )

  useEffect(() => {
    if (token) submit()
  }, [token])

  useEffect(() => {
    setError()
    if (verificationCode?.length === CODE_LENGTH) submit()
  }, [verificationCode])

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>
            Check your email
          </Text>
          <View>
            <Text style={styles.subTitle}>We've sent a 6 digit code to:</Text>
            <Text style={[styles.subTitle, { marginVertical: 10, fontWeight: 'bold' }]}>{email}</Text>
            <Text style={styles.subTitle}>The code will expire shortly, so please enter it here soon.</Text>
          </View>
        </View>
        <View style={styles.content}>
          {loading && (
            <Loading />
          )}
          {!loading && (
            <CodeField
              ref={verificationCodeRef}
              {...props}
              value={verificationCode}
              onChangeText={setVerificationCode}
              cellCount={CODE_LENGTH}
              rootStyle={styles.codeFieldRoot}
              keyboardType='number-pad'
              textContentType='oneTimeCode'
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.codeFieldCell, isFocused && styles.codeFieldCellFocused]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : <Text> </Text>)}
                </Text>
              )}
            />
          )}
          <TouchableOpacity onPress={resendCode} style={styles.resendCodeLink}>
            <Text style={styles.resendCodeLinkText}><FontAwesome5Icon name='redo-alt' /> Resend code</Text>
          </TouchableOpacity>
        </View>
        <FormattedError error={error} styles={controlStyles} />
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
