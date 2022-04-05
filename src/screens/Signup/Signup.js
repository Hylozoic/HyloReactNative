import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import validator from 'validator'
import { openURL } from 'navigation/linking'
import { isIOS } from 'util/platform'
import { useFocusEffect } from '@react-navigation/core'
import FormattedError from 'components/FormattedError'
import {
  loginWithApple, loginWithFacebook, loginWithGoogle,
  LOGIN_WITH_APPLE, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE
} from 'screens/Login/actions'
import { getLocalUserSettings, updateLocalUserSettings } from 'screens/Signup/Signup.store'
import sendEmailVerification from 'store/actions/sendEmailVerification'
import { getSignupState, SignupState } from 'store/selectors/getSignupState'
import { CHECK_LOGIN, FETCH_CURRENT_USER, LOGIN, UPDATE_USER_SETTINGS } from 'store/constants'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import AppleLoginButton from 'screens/Login/AppleLoginButton'
import FbLoginButton from 'screens/Login/FbLoginButton'
import GoogleLoginButton from 'screens/Login/GoogleLoginButton'
import providedStyles from './Signup.styles'
import checkLogin from 'store/actions/checkLogin'

const backgroundImage = require('assets/signin_background.png')
const merkabaImage = require('assets/merkaba_white.png')

export default function Signup({ navigation, route }) {
  const safeAreaInsets = useSafeAreaInsets()
  const dispatch = useDispatch()
  const loading = useSelector(state => {
    return state.pending[LOGIN] ||
      state.pending[LOGIN_WITH_APPLE] ||
      state.pending[LOGIN_WITH_FACEBOOK] ||
      state.pending[LOGIN_WITH_GOOGLE] ||
      state.pending[CHECK_LOGIN] ||
      state.pending[FETCH_CURRENT_USER] ||
      state.pending[UPDATE_USER_SETTINGS]
  })
  const signupState = useSelector(getSignupState)
  const userSettings = useSelector(getLocalUserSettings)
  const [email, providedSetEmail] = useState(route.params?.email || userSettings?.email)
  const [pending, setPending] = useState()
  const [error, setError] = useState()
  const [socialLoginError, setSocialLoginError] = useState()
  const [canSubmit, setCanSubmit] = useState(pending || !email)

  const signupRedirect = () => {
    console.log('!!!! in signupRedirect -- signupState', signupState)
    switch (signupState) {
      case SignupState.None: {
        navigation.navigate('Signup Intro')
        break
      }
      case SignupState.EmailValidation: {
        navigation.navigate('SignupEmailValidation')
        break
      }
      case SignupState.Registration: {
        navigation.navigate('SignupRegistration')
        break
      }
      case SignupState.InProgress: {
        navigation.navigate('SignupUploadAvatar')
        break
      }
    }
  }

  useEffect(signupRedirect, [loading, signupState])
  useFocusEffect(signupRedirect)

  const createErrorNotification = providedError => {
    setSocialLoginError(providedError)
  }

  const setEmail = validateEmail => {
    setSocialLoginError()
    setError()
    setCanSubmit(!validator.isEmail(validateEmail))
    providedSetEmail(validateEmail)
  }

  const socialLoginMaker = loginWith => async token => {
    const action = await dispatch(loginWith(token))
    if (action.error) {
      const errorMessage = action?.payload?.response?.body
      return errorMessage ? { errorMessage } : null
    } else {
      dispatch(checkLogin())
    }
  }

  const submit = async () => {
    const genericError = new Error('An account may already exist for this email address, Login or try resetting your password.')
    try {
      setPending(true)
      await dispatch(updateLocalUserSettings({ email }))
      const result = await dispatch(sendEmailVerification(email))
      if (result.payload.getData().success) {
        navigation.navigate('SignupEmailValidation')
      } else {
        throw genericError
      }
    } catch (err) {
      setError(genericError.message)
    } finally {
      setPending(false)
    }
  }

  const styles = {
    ...providedStyles,
    background: {
      ...providedStyles.background,
      height: providedStyles.background.height + safeAreaInsets.top
    },
    backgroundImage: {
      ...providedStyles.backgroundImage,
      height: providedStyles.backgroundImage.height + safeAreaInsets.top
    }
  }

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView>
        {loading && <Text style={styles.banner}>SIGNING UP...</Text>}
        {socialLoginError && <Text style={styles.errorBanner}>{socialLoginError}</Text>}
        <ImageBackground
          source={backgroundImage}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <Image source={merkabaImage} style={styles.merkabaImage} />
          <Text style={styles.title}>Welcome to Hylo</Text>
          <Text style={styles.subTitle}>Stay connected, organized, and engaged with your group.</Text>
        </ImageBackground>
        <View style={styles.content}>
          <Text style={styles.labelText}>Enter your email address to get started:</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={value => setEmail(value)}
            returnKeyType='next'
            underlineColorAndroid='transparent'
          />
          <FormattedError styles={styles} error={error} action='Signup' />
          <Button
            style={styles.signupButton}
            text={pending ? 'Saving...' : 'Continue'}
            onPress={submit}
            disabled={canSubmit}
          />
          <View style={styles.connectWith}>
            <Text style={styles.connectWithText}>Or sign up using:</Text>
            {isIOS && (
              <AppleLoginButton
                signup
                style={styles.appleLoginButton}
                onLoginFinished={socialLoginMaker(loginWithApple)}
                createErrorNotification={createErrorNotification}
              />
            )}
            <GoogleLoginButton
              signup
              style={styles.googleLoginButton}
              onLoginFinished={socialLoginMaker(loginWithGoogle)}
              createErrorNotification={createErrorNotification}
            />
            <FbLoginButton
              signup
              style={styles.facebookLoginButton}
              onLoginFinished={socialLoginMaker(loginWithFacebook)}
              createErrorNotification={createErrorNotification}
            />
          </View>
          <View style={styles.login}>
            <Text style={styles.haveAccount}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButton}>Log in now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.terms}>
            <Text style={{ ...styles.haveAccount, ...styles.termsText }}>
              Your data is safe with Hylo. By clicking the "Sign Up" button above you are agreeing to these terms:
            </Text>
            <TouchableOpacity onPress={() => openURL('https://www.hylo.com/terms')}>
              <Text style={{ ...styles.loginButton, ...styles.termsText }}>https://www.hylo.com/terms</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
