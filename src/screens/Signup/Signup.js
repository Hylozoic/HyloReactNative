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
import { navigateToLinkingPathInApp, openURL } from 'navigation/linking'
import { isIOS } from 'util/platform'
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/core'
import FormattedError from 'components/FormattedError'
import {
  loginWithApple, loginWithFacebook, loginWithGoogle
} from 'screens/Login/actions'
import sendEmailVerification from 'store/actions/sendEmailVerification'
import { getAuthState, AuthState } from 'store/selectors/getAuthState'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import AppleLoginButton from 'screens/Login/AppleLoginButton'
import FbLoginButton from 'screens/Login/FbLoginButton'
import GoogleLoginButton from 'screens/Login/GoogleLoginButton'
import providedStyles from './Signup.styles'
import checkLogin from 'store/actions/checkLogin'

const backgroundImage = require('assets/signin_background.png')
const merkabaImage = require('assets/merkaba_white.png')
const genericError = new Error('An account may already exist for this email address, Login or try resetting your password.')

export default function Signup () {
  const route = useRoute()
  const navigation = useNavigation()
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name)
  const safeAreaInsets = useSafeAreaInsets()
  const dispatch = useDispatch()
  const authState = useSelector(getAuthState)
  const [email, providedSetEmail] = useState(route.params?.email)
  const [loading, setLoading] = useState()
  const [error, setError] = useState(route.params?.error)
  // WIP: Positive mesage for `checkInvitation` result
  const [message, setMessage] = useState(route.params?.message)
  const [socialLoginError, setSocialLoginError] = useState()
  const [canSubmit, setCanSubmit] = useState(loading || !email)

  console.log('!!! message, error', message, error)
  // const setStateFromRouteParams = () => {
  //   const errorRouteParam = route.params?.error
  //   const messageRouteParam = route.params?.message

  //   if (errorRouteParam) setError(errorRouteParam)
  //   if (messageRouteParam) setMessage(messageRouteParam)

  //   navigation.setParams()
  // }

  const signupRedirect = () => {
    switch (authState) {
      case AuthState.EmailValidation: {
        navigation.navigate('SignupEmailValidation', route.params)
        break
      }
      case AuthState.Registration: {
        navigation.navigate('SignupRegistration', route.params)
        break
      }
      case AuthState.SignupInProgress: {
        if (!['SignupUploadAvatar', 'SignupSetLocation'].includes(currentRouteName)) {
          navigation.navigate('SignupUploadAvatar', route.params)
        }
        break
      }
    }
  }

  useEffect(() => {
    if (!loading) signupRedirect()
  }, [loading, authState])

  // Probably still need this
  // useFocusEffect(() => {
  //   signupRedirect()
  // })

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
    try {
      setLoading(true)
      const response = await dispatch(loginWith(token))

      if (response.error) {
        const errorMessage = response?.payload?.response?.body
        return errorMessage ? { errorMessage } : null
      } else {
        dispatch(checkLogin())
      }
    } catch (e) {
      return e.message
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    try {
      setLoading(true)

      const result = await dispatch(sendEmailVerification(email))

      if (result.payload.getData().success) {
        navigateToLinkingPathInApp(`/signup/verify-email?email=${email}`, true)
      } else {
        throw genericError
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
            text={loading ? 'Saving...' : 'Continue'}
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
