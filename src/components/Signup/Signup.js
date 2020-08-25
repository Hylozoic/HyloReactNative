import React from 'react'
import {
  View,
  Text,
  Linking,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { isIOS } from 'util/platform'
import Button from '../Button'
import AppleLoginButton from '../Login/AppleLoginButton'
import FbLoginButton from '../Login/FbLoginButton'
import GoogleLoginButton from '../Login/GoogleLoginButton'
import styles from './Signup.styles'
const backgroundImage = require('../../assets/signin_background.png')
const merkabaImage = require('../../assets/merkaba_white.png')

export default class Signup extends React.Component {
  static navigationOptions = {
    header: null,
    headerBackTitle: null
  }

  state = {
    ssoError: false
  }

  createErrorNotification = error => {
    this.setState({ssoError: error})
  }

  render () {
    const {
      goToSignupFlow, goToLogin, error, loginWithApple, loginWithFacebook, loginWithGoogle, pending
    } = this.props
    const { ssoError } = this.state
    return <ScrollView contentContainerStyle={styles.container}>
      {pending && <Text style={styles.banner}>SIGNING UP...</Text>}
      {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <Image source={merkabaImage} style={styles.merkabaImage} />
      </ImageBackground>
      <View style={styles.paddedContainer}>
        <Text style={styles.title}>Sign up to get started with Hylo</Text>
        {error && <View style={styles.errorWrapper}><Text style={styles.error}>{error}</Text></View>}
        <Text style={styles.subTitle}>Stay connected, organized and engaged with your community.</Text>
        <Button text='Sign Up' style={styles.signupButton} onPress={goToSignupFlow} />
        <View style={styles.connectWith}>
          <Text style={styles.connectWithText}>Or sign up using:</Text>
          {isIOS && <AppleLoginButton
            signup
            style={styles.appleLoginButton}
            onLoginFinished={loginWithApple}
            createErrorNotification={this.createErrorNotification}
          />}
          <GoogleLoginButton
            signup
            style={styles.googleLoginButton}
            onLoginFinished={loginWithGoogle}
            createErrorNotification={this.createErrorNotification}
          />
          <FbLoginButton
            signup
            style={styles.facebookLoginButton}
            onLoginFinished={loginWithFacebook}
            createErrorNotification={this.createErrorNotification}
          />
        </View>
        <View style={styles.login}>
          <Text style={styles.haveAccount}>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}><Text style={styles.loginButton}>Log in now</Text></TouchableOpacity>
        </View>
        <View style={styles.terms}>
          <Text style={{...styles.haveAccount, ...styles.termsText}}>
            Your data is safe with Hylo. By clicking the "Sign Up" button above you are agreeing to these terms:
          </Text>
          <TouchableOpacity
            onPress={() => openURL('https://www.hylo.com/terms')}>
            <Text style={{...styles.loginButton, ...styles.termsText}}>https://www.hylo.com/terms</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  }
}

export function openURL (url) {
  return Linking.canOpenURL(url).then(supported => supported && Linking.openURL(url))
}
