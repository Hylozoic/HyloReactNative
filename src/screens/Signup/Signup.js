import React, { useState } from 'react'
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
import logout from 'store/actions/logout'
import FormattedError from 'components/FormattedError'
import {
  loginWithApple, loginWithFacebook, loginWithGoogle,
  LOGIN_WITH_APPLE, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE
} from 'screens/Login/actions'
import { getLocalUserSettings, updateLocalUserSettings } from 'screens/SignupFlow/SignupFlow.store'
import { sendEmailVerification } from 'store/actions/sendEmailVerification'
import { getSignupState, SignupState } from 'store/selectors/getSignupState'
import { FETCH_CURRENT_USER, LOGIN } from 'store/constants'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import AppleLoginButton from 'screens/Login/AppleLoginButton'
import FbLoginButton from 'screens/Login/FbLoginButton'
import GoogleLoginButton from 'screens/Login/GoogleLoginButton'
import providedStyles from './Signup.styles'

const backgroundImage = require('assets/signin_background.png')
const merkabaImage = require('assets/merkaba_white.png')

export default function Signup ({ navigation, route }) {
  const dispatch = useDispatch()
  const loginPending = useSelector(state => {
    return state.pending[LOGIN] ||
      state.pending[LOGIN_WITH_APPLE] ||
      state.pending[LOGIN_WITH_FACEBOOK] ||
      state.pending[LOGIN_WITH_GOOGLE] ||
      state.pending[FETCH_CURRENT_USER]
  })
  const userSettings = useSelector(getLocalUserSettings)
  const storedEmail = userSettings?.email
  const emailFromPath = route.params?.email
  const providedEmail = emailFromPath || storedEmail
  const [email, providedSetEmail] = useState(providedEmail)
  const [pending, setPending] = useState()
  const [error, setError] = useState()
  const [ssoError, setSsoError] = useState()
  const [canSubmit, setCanSubmit] = useState(pending || !email)
  const signupState = useSelector(getSignupState)
  const safeAreaInsets = useSafeAreaInsets()

  // Maybe turn this into a signupState hook as it may be reused
  // also on the sign-up pages?
  useFocusEffect(() => {
    switch (signupState) {
      // case SignupState.None: {
      //   // do nothing, we're in the right place?
      // }
      case SignupState.EmailValidation: {
        navigation.navigate('SignupFlow0', route.params)
        return null
      }
      case SignupState.AccountDetails: {
        navigation.navigate('SignupFlow1')
        return null
      }
      case SignupState.ProfileDetails: {
        navigation.navigate('SignupFlow2')
        return null
      }
    }
  })

  // const signupInProgress = useSelector(getSignupInProgress)
  const createErrorNotification = providedError => {
    setSsoError(providedError)
  }
  const setEmail = validateEmail => {
    error && setError()
    setCanSubmit(!validator.isEmail(validateEmail))
    providedSetEmail(validateEmail)
  }
  const socialLoginMaker = loginWith => async token => {
    await dispatch(logout())
    const action = await dispatch(loginWith(token))
    if (action.error) {
      const errorMessage = action?.payload?.response?.body
      return errorMessage ? { errorMessage } : null
    }
  }
  const submit = async () => {
    const genericError = new Error('An account may already exist for this email address, Login or try resetting your password.')
    try {
      setPending(true)
      await dispatch(updateLocalUserSettings({ email }))
      const result = await dispatch(sendEmailVerification(email))
      if (result.payload.data.getData().success) {
        navigation.navigate('SignupFlow0')
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
        {loginPending && <Text style={styles.banner}>SIGNING UP...</Text>}
        {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
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
            {isIOS && <AppleLoginButton
              signup
              style={styles.appleLoginButton}
              onLoginFinished={socialLoginMaker(loginWithApple)}
              createErrorNotification={createErrorNotification}
                      />}
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
