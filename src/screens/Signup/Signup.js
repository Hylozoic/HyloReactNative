import React, { useState } from 'react'
import {
  View,
  Text,
  Linking,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isIOS } from 'util/platform'
import { useFocusEffect } from '@react-navigation/native'
import { getEmailToVerify } from 'screens/SignupFlow/SignupFlow.store'
import Button from 'components/Button'
import AppleLoginButton from 'screens/Login/AppleLoginButton'
import FbLoginButton from 'screens/Login/FbLoginButton'
import GoogleLoginButton from 'screens/Login/GoogleLoginButton'
import getSignupInProgress from 'store/selectors/getSignupInProgress'
import providedStyles from './Signup.styles'

const backgroundImage = require('assets/signin_background.png')
const merkabaImage = require('assets/merkaba_white.png')

export default function Signup ({
  goToSignupFlow, goToLogin, error, loginWithApple,
  loginWithFacebook, loginWithGoogle, pending,
  navigation, route
}) {
  const [ssoError, setSsoError] = useState(false)
  const safeAreaInsets = useSafeAreaInsets()
  const createErrorNotification = error => {
    setSsoError(error)
  }
  const signupInProgress = useSelector(getSignupInProgress)
  const emailToVerify = useSelector(getEmailToVerify) || route.params?.email

  useFocusEffect(() => {
    if (signupInProgress) {
      navigation.navigate('SignupFlow1')
    }

    if (emailToVerify) {
      navigation.navigate('Signup - Email Verification - Finish', { email: emailToVerify })
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
    <ScrollView style={styles.container}>
      {pending && <Text style={styles.banner}>SIGNING UP...</Text>}
      {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <Image source={merkabaImage} style={styles.merkabaImage} />
      </ImageBackground>
      <View style={styles.paddedContainer}>
        <Text style={styles.title}>Sign up to get started with Hylo</Text>
        {error && <View style={styles.errorWrapper}><Text style={styles.error}>{error}</Text></View>}
        <Text style={styles.subTitle}>Stay connected, organized and engaged with your group.</Text>
        <Button text='Sign Up' style={styles.signupButton} onPress={goToSignupFlow} />
        <View style={styles.connectWith}>
          <Text style={styles.connectWithText}>Or sign up using:</Text>
          {isIOS && <AppleLoginButton
            signup
            style={styles.appleLoginButton}
            onLoginFinished={loginWithApple}
            createErrorNotification={createErrorNotification}
                    />}
          <GoogleLoginButton
            signup
            style={styles.googleLoginButton}
            onLoginFinished={loginWithGoogle}
            createErrorNotification={createErrorNotification}
          />
          <FbLoginButton
            signup
            style={styles.facebookLoginButton}
            onLoginFinished={loginWithFacebook}
            createErrorNotification={createErrorNotification}
          />
        </View>
        <View style={styles.login}>
          <Text style={styles.haveAccount}>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}><Text style={styles.loginButton}>Log in now</Text></TouchableOpacity>
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
  )
}

export function openURL (url) {
  return Linking.canOpenURL(url).then(supported => supported && Linking.openURL(url))
}
