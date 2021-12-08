import React, { useState } from 'react'
import {
  View,
  Text,
  Linking,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import validator from 'validator'
import { isIOS } from 'util/platform'
import { useFocusEffect } from '@react-navigation/core'
import { loginWithApple, loginWithFacebook, loginWithGoogle } from 'screens/Login/actions'
import { getPending } from 'screens/Login/Login.store'
import FormattedError from 'components/FormattedError'
// 
import { getUserSettings, updateLocalUserSettings } from 'screens/SignupFlow/SignupFlow.store'
import { sendEmailVerification } from 'store/actions/sendEmailVerification'
// 
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import AppleLoginButton from 'screens/Login/AppleLoginButton'
import FbLoginButton from 'screens/Login/FbLoginButton'
import GoogleLoginButton from 'screens/Login/GoogleLoginButton'
import getSignupInProgress from 'store/selectors/getSignupInProgress'
import providedStyles from './Signup.styles'

const backgroundImage = require('assets/signin_background.png')
const merkabaImage = require('assets/merkaba_white.png')

// dispatch(updateLocalUserSettings({ email: null, emailVerified: false }))

export default function Signup ({ navigation, route }) {
  const dispatch = useDispatch()
  const loginPending = useSelector(getPending)
  const loginError = useSelector(state => state.session.loginError)
  const storedEmail = useSelector(getUserSettings)?.email || route.params?.email
  const [email, setEmailBase] = useState(storedEmail)
  const [pending, setPending] = useState()
  const [error, setError] = useState()
  const [canSubmit, setCanSubmit] = useState(pending || !email)
  const setEmail = email => {
    error && setError()
    setCanSubmit(!validator.isEmail(email))
    setEmailBase(email)
  }
  const submit = async () => {
    try {
      setPending(true)
      await dispatch(updateLocalUserSettings({ email }))
      await dispatch(sendEmailVerification(email))
      navigation.navigate('Signup - Email Verification - Finish')
    } catch (error) {
      setError(error.message)
    } finally {
      setPending(false)
    }
  }

  const safeAreaInsets = useSafeAreaInsets()
  const createErrorNotification = error => {
    setError(error)
  }
  const signupInProgress = useSelector(getSignupInProgress)

  useFocusEffect(() => {
    if (signupInProgress) {
      navigation.navigate('SignupFlow1')
    }
  })

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
        {loginError && <Text style={styles.errorBanner}>{error}</Text>}
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
              onLoginFinished={() => dispatch(loginWithApple)}
              createErrorNotification={createErrorNotification}
                      />}
            <GoogleLoginButton
              signup
              style={styles.googleLoginButton}
              onLoginFinished={() => dispatch(loginWithGoogle)}
              createErrorNotification={createErrorNotification}
            />
            <FbLoginButton
              signup
              style={styles.facebookLoginButton}
              onLoginFinished={() => dispatch(loginWithFacebook)}
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

export function openURL (url) {
  return Linking.canOpenURL(url).then(supported => supported && Linking.openURL(url))
}
