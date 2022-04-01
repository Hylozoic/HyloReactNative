import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field'
import {
  updateLocalUserSettings,
  getLocalUserSettings
} from 'screens/SignupFlow/SignupFlow.store'
import verifyEmail from 'store/actions/verifyEmail'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import FormattedError from 'components/FormattedError'
import controlStyles from 'components/SettingControl/SettingControl.styles'
import styles from './SignupFlow0.styles'
import logout from 'store/actions/logout'

const CODE_LENGTH = 6

export default function SignupFlow0 ({ navigation, route }) {
  const dispatch = useDispatch()
  const [pending, setPending] = useState()
  const [verificationCode, setVerificationCodeBase] = useState()
  const [error, setError] = useState()
  const verificationCodeRef = useBlurOnFulfill({
    value: verificationCode,
    cellCount: CODE_LENGTH
  })
  const setVerificationCode = code => {
    setVerificationCodeBase(code)
    setError()
    if (code?.length === CODE_LENGTH) {
      submit(code)
    }
  }
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode
  })
  const email = useSelector(getLocalUserSettings)?.email || route.params?.email

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => {
        dispatch(updateLocalUserSettings({ email: null }))
        dispatch(logout())
        navigation.navigate('Signup Intro', { email })
      }
    })
  })

  const submit = async (code) => {
    try {
      setPending(true)
      await dispatch(verifyEmail(email, code))
      await dispatch(updateLocalUserSettings({ email }))
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
          <View>
            <Text style={styles.subTitle}>We've sent a 6 digit code to:</Text>
            <Text style={[styles.subTitle, { marginVertical: 10, fontWeight: 'bold' }]}>{email}</Text>
            <Text style={styles.subTitle}>The code will expire shortly, so please enter it here soon.</Text>
          </View>
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
        <FormattedError error={error} styles={controlStyles} />
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
