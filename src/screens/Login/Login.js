import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import loginAction from 'store/actions/login'
import {
  loginWithApple as loginWithAppleAction,
  loginWithFacebook as loginWithFacebookAction,
  loginWithGoogle as loginWithGoogleAction,
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from './actions'
import { FETCH_CURRENT_USER, LOGIN } from 'store/constants'
import getRouteParam from 'store/selectors/getRouteParam'
import validator from 'validator'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import AppleLoginButton from './AppleLoginButton'
import FbLoginButton from './FbLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import styles from './Login.styles'
import checkLogin from 'store/actions/checkLogin'

export default function Login () {
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()
  const defaultLoginEmail = useSelector(state => state.session?.defaultLoginEmail)
  const message = decodeURIComponent(getRouteParam('message', route))
  console.log('!!!! message', route)
  // const returnToURLFromLink = decodeURIComponent(getRouteParam('n', props.route))
  // const loginToken = decodeURIComponent(getRouteParam('t', props.route) || getRouteParam('loginToken', props.route))
  // const loginTokenUserId = getRouteParam('u', props.route) || getRouteParam('userId', props.route)
  // const bannerMessage = getRouteParam('bannerMessage', props.route)
  const [email, providedSetEmail] = useState(defaultLoginEmail)
  const [password, providedSetPassword] = useState()
  const [securePassword, setSecurePassword] = useState(true)
  const [emailIsValid, setEmailIsValid] = useState()
  const [isConnected, setIsConnected] = useState()
  const [socialLoginError, setSocialLoginError] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const passwordInputRef = useRef()

  const setEmail = validateEmail => {
    setError()
    setSocialLoginError()
    setEmailIsValid(validator.isEmail(validateEmail))
    providedSetEmail(validateEmail)
  }

  const setPassword = passwordValue => {
    setError()
    setSocialLoginError()
    providedSetPassword(passwordValue)
  }

  useFocusEffect(() => {
    const handleConnectivityChange = ({ isConnected: isConnectedParam }) => {
      if (isConnectedParam !== isConnected) setIsConnected(isConnectedParam)
    }

    return NetInfo.addEventListener(handleConnectivityChange)
  })

  const finishSocialLogin = async response => {
    try {
      setError()
      if (response.error) {
        const errorMessage = response?.payload?.response?.body
        // return errorMessage ? { errorMessage } : null
        if (errorMessage) {
          setSocialLoginError(errorMessage)
        }
      }
      await dispatch(checkLogin())
    } catch (err) {
      setSocialLoginError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loginWithApple = async token => {
    setLoading(true)
    const response = await dispatch(loginWithAppleAction(token))
    return finishSocialLogin(response)
  }

  const loginWithFacebook = async token => {
    setLoading(true)
    const response = await dispatch(loginWithFacebookAction(token))
    return finishSocialLogin(response)
  }

  const loginWithGoogle = async token => {
    setLoading(true)
    const response = await dispatch(loginWithGoogleAction(token))
    return finishSocialLogin(response)
  }

  const login = async () => {
    try {
      setLoading(true)
      const response = await dispatch(loginAction(email, password))
      const responseError = response.payload?.getData().error

      if (responseError) setError(responseError)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
        {socialLoginError && <Text style={styles.errorBanner}>{socialLoginError}</Text>}
        {/* TODO: Bring back online status message / toast */}
        {/* {!isConnected && <Text style={styles.errorBanner}>OFFLINE; TRYING TO RECONNECT...</Text>} */}
        {loading && <Text style={styles.banner}>LOGGING IN...</Text>}
        {/* {bannerMessage && <Text style={styles.banner}>{bannerMessage}</Text>} */}
        <Image
          style={styles.logo}
          source={require('assets/merkaba-green-on-white.png')}
        />
        <Text style={styles.title}>Log in to Hylo</Text>
        <FormError>{error}</FormError>
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>Your email address</Text>
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
                // UPGRADE TODO: Fix with this: https://stackoverflow.com/a/59626713
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
        <View style={styles.connectWith}>
          <Text style={styles.connectWithText}>Or connect with:</Text>
          <AppleLoginButton
            style={styles.appleLoginButton}
            onLoginFinished={loginWithApple}
            createErrorNotification={setSocialLoginError}
          />
          <GoogleLoginButton
            style={styles.googleLoginButton}
            onLoginFinished={loginWithGoogle}
            createErrorNotification={setSocialLoginError}
          />
          <FbLoginButton
            style={styles.facebookLoginButton}
            onLoginFinished={loginWithFacebook}
            createErrorNotification={setSocialLoginError}
          />
        </View>
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
