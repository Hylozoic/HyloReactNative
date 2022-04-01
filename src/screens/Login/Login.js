import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { SafeAreaView } from 'react-native-safe-area-context'
import loginAction from 'store/actions/login'
import logoutAction from 'store/actions/logout'
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
import { getSignupInProgress } from 'store/selectors/getSignupState'
import validator from 'validator'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import AppleLoginButton from './AppleLoginButton'
import FbLoginButton from './FbLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import styles from './Login.styles'

export default function Login (props) {
  const dispatch = useDispatch()
  const pending = useSelector(state => {
    return state.pending[LOGIN] ||
      state.pending[LOGIN_WITH_APPLE] ||
      state.pending[LOGIN_WITH_FACEBOOK] ||
      state.pending[LOGIN_WITH_GOOGLE] ||
      state.pending[FETCH_CURRENT_USER]
  })
  const signupInProgress = useSelector(getSignupInProgress)
  const defaultLoginEmail = useSelector(state => state.session?.defaultLoginEmail)
  const formError = useSelector(state => state.session.loginError)
  const goToSignup = () => props.navigation.navigate('Signup')
  const goToResetPassword = () => props.navigation.navigate('ForgotPassword')
  // const returnToURLFromLink = decodeURIComponent(getRouteParam('n', props.route))
  // const loginToken = decodeURIComponent(getRouteParam('t', props.route) || getRouteParam('loginToken', props.route))
  // const loginTokenUserId = getRouteParam('u', props.route) || getRouteParam('userId', props.route)
  const bannerMessage = getRouteParam('bannerMessage', props.route)
  const [email, providedSetEmail] = useState(defaultLoginEmail)
  const [password, setPassword] = useState()
  const [securePassword, setSecurePassword] = useState()
  const [emailIsValid, setEmailIsValid] = useState()
  const [isConnected, setIsConnected] = useState()
  const [ssoError, setSsoError] = useState()
  const passwordInputRef = useRef()

  const setEmail = validateEmail => {
    setEmailIsValid(validator.isEmail(validateEmail))
    providedSetEmail(validateEmail)
  }

  const handleConnectivityChange = ({ isConnected: isConnectedParam }) => {
    if (isConnectedParam !== isConnected) setIsConnected(isConnectedParam)
  }

  useFocusEffect(() => {
    // Signup state redirection happens in Signup Intro component
    if (signupInProgress) {
      props.navigation.navigate('Signup')
    }
    return NetInfo.addEventListener(handleConnectivityChange)
  })

  const finishLogin = action => {
    if (action.error) {
      const errorMessage = action?.payload?.response?.body
      return errorMessage ? { errorMessage } : null
    }
  }

  const loginWithApple = async token => {
    await dispatch(logoutAction())
    const response = dispatch(await loginWithAppleAction(token))
    return finishLogin(response)
  }

  const loginWithFacebook = async token => {
    await dispatch(logoutAction())
    const response = dispatch(await loginWithFacebookAction(token))
    return finishLogin(response)
  }

  const loginWithGoogle = async token => {
    await dispatch(logoutAction())
    const response = dispatch(await loginWithGoogleAction(token))
    return finishLogin(response)
  }

  const login = async () => {
    // await dispatch(logoutAction())
    const response = dispatch(await loginAction(email, password))
    return finishLogin(response)
  }

  const createErrorNotification = error => setSsoError(error)

  const togglePassword = () => {
    setSecurePassword(!securePassword)
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.login} style={styles.container}>
        {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
        {/* TODO: Bring back online status message / toast */}
        {/* {!isConnected && <Text style={styles.errorBanner}>OFFLINE; TRYING TO RECONNECT...</Text>} */}
        {pending && <Text style={styles.banner}>LOGGING IN...</Text>}
        {bannerMessage && <Text style={styles.banner}>{bannerMessage}</Text>}
        <Image
          style={styles.logo}
          source={require('assets/merkaba-green-on-white.png')}
        />
        <Text style={styles.title}>Log in to Hylo</Text>
        {formError && <FormError />}
        {!formError && (
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>Your email address</Text>
          </View>
        )}
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
          <TouchableOpacity onPress={login} style={styles.loginButton}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.connectWith}>
          <Text style={styles.connectWithText}>Or connect with:</Text>
          <AppleLoginButton
            style={styles.appleLoginButton}
            onLoginFinished={loginWithApple}
            createErrorNotification={createErrorNotification}
          />
          <GoogleLoginButton
            style={styles.googleLoginButton}
            onLoginFinished={loginWithGoogle}
            createErrorNotification={createErrorNotification}
          />
          <FbLoginButton
            style={styles.facebookLoginButton}
            onLoginFinished={loginWithFacebook}
            createErrorNotification={createErrorNotification}
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

export function FormError () {
  const rowStyle = styles.emailErrorRow
  const triangleStyle = styles.emailTriangle
  const message = 'Username or Password was incorrect'
  return (
    <View style={styles.errorView}>
      <View style={rowStyle}>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
      <View style={triangleStyle} />
    </View>
  )
}
