import React, { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import loginAction from 'store/actions/login'
import validator from 'validator'
import errorMessages from 'util/errorMessages'
import SocialAuth from 'components/SocialAuth'
import styles from './Login.styles'

export default function Login () {
  const navigation = useNavigation()
  const passwordInputRef = useRef()
  const route = useRoute()
  const dispatch = useDispatch()
  const defaultLoginEmail = useSelector(state => state.session?.defaultLoginEmail)

  const [email, providedSetEmail] = useState(defaultLoginEmail)
  const [password, providedSetPassword] = useState()
  const [securePassword, setSecurePassword] = useState(true)
  const [emailIsValid, setEmailIsValid] = useState()
  const [bannerError, setBannerError] = useState()
  const [bannerMessage, setBannerMessage] = useState()
  const [formError, setFormError] = useState()
  const bannerMessageParam = route?.params?.bannerMessage
  const bannerErrorParam = route?.params?.bannerError

  const setError = errorMessage => {
    setFormError(errorMessages(errorMessage))
  }

  const setLoadingMessage = loadingStatus => {
    if (loadingStatus) setBannerMessage('LOGGING IN...')
  }

  const clearErrors = useCallback(() => {
    setError()
    setBannerError()
    setBannerMessage()
  }, [])

  useFocusEffect(
    useCallback(() => {
      clearErrors()
      if (bannerErrorParam) setBannerError(errorMessages(bannerErrorParam))
      if (bannerMessageParam) setBannerMessage(bannerMessageParam)
    }, [bannerErrorParam, bannerMessageParam, clearErrors])
  )

  const setEmail = validateEmail => {
    clearErrors()
    setEmailIsValid(validator.isEmail(validateEmail))
    providedSetEmail(validateEmail)
  }

  const setPassword = passwordValue => {
    clearErrors()
    providedSetPassword(passwordValue)
  }

  const handleSocialAuthStart = () => {
    setLoadingMessage(true)
  }

  const handleSocialAuthComplete = error => {
    if (error) setBannerError(error)
    setLoadingMessage(false)
  }

  const login = async () => {
    try {
      setLoadingMessage(true)
      const response = await dispatch(loginAction(email, password))
      const responseError = response.payload?.getData().error

      if (responseError) {
        setError(responseError)
      }

      setLoadingMessage(false)
    } catch (err) {
      setLoadingMessage(false)
      setError(err.message)
    }
  }

  const togglePassword = () => {
    setSecurePassword(!securePassword)
  }

  const goToSignup = () => navigation.navigate('Signup')

  const goToResetPassword = () => navigation.navigate('ForgotPassword')

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.login} style={styles.container}>
        {bannerError && <Text style={styles.bannerError}>{bannerError}</Text>}
        {(!bannerError && bannerMessage) && <Text style={styles.bannerMessage}>{bannerMessage}</Text>}

        <Image
          style={styles.logo}
          source={require('assets/merkaba-green-on-white.png')}
        />
        <Text style={styles.title}>Log in to Hylo</Text>
        <FormError>{formError}</FormError>
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>Email address</Text>
        </View>
        <View style={styles.paddedRow}>
          <View style={emailIsValid ? styles.paddedBorderValid : styles.paddedBorder}>
            <View style={styles.leftInputView}>
              <TextInput
                style={styles.textInput}
                onChangeText={setEmail}
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                onSubmitEditing={() => passwordInputRef.current.focus()}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={styles.rightIconView}>
              {emailIsValid && (
                <EntypoIcon name='check' style={styles.iconGreen} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>Password</Text>
          <TouchableOpacity onPress={goToResetPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paddedRow}>
          <View style={styles.paddedBorder}>
            <View style={styles.leftInputView}>
              <TextInput
                style={styles.textInput}
                secureTextEntry={securePassword}
                autoCapitalize='none'
                ref={passwordInputRef}
                onChangeText={setPassword}
                returnKeyType='go'
                selectTextOnFocus
                onSubmitEditing={() => login()}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={styles.rightIconView}>
              <EntypoIcon
                name={securePassword ? 'eye' : 'eye-with-line'}
                style={styles.iconOpaque}
                onPress={togglePassword}
              />
            </View>
          </View>
        </View>
        <View style={styles.paddedRow}>
          <TouchableOpacity onPress={login} disabled={!emailIsValid} style={styles.loginButton}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
        <SocialAuth onStart={handleSocialAuthStart} onComplete={handleSocialAuthComplete} />
        <SignupLink goToSignup={goToSignup} />
      </ScrollView>
    </SafeAreaView>
  )
}

export function SignupLink ({ goToSignup }) {
  return (
    <View style={styles.signup}>
      <Text style={styles.signupText}>Dont have an account? </Text>
      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.signupLink}>Sign up now</Text>
      </TouchableOpacity>
    </View>
  )
}

export function FormError ({ children }) {
  const rowStyle = styles.emailErrorRow
  const triangleStyle = styles.emailTriangle

  if (!children) return null

  return (
    <View style={styles.errorView}>
      <View style={rowStyle}>
        <Text style={styles.errorMessage}>{children}</Text>
      </View>
      <View style={triangleStyle} />
    </View>
  )
}

// NOTE: This works, but I don't trust it and it could/should probably be moved
//       into a modal at the level of the `RootNavigator`
// import NetInfo from '@react-native-community/netinfo'
// const [isConnected, setIsConnected] = useState()
// useFocusEffect(
//   useCallback(() => {
//     const handleConnectivityChange = ({ isConnected: isConnectedParam }) => {
//       if (isConnectedParam !== isConnected) {
//         setIsConnected(isConnectedParam)
//         setBannerError(!isConnectedParam ? 'OFFLINE; TRYING TO RECONNECT...' : null)
//       }
//     }

//     return NetInfo.addEventListener(handleConnectivityChange)
//   }, [isConnected])
// )
