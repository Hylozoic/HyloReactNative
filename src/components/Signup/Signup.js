import React from 'react'
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Button from '../Button'
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

  render () {
    const { goToSignupFlow, goToLogin, error, loginWithFacebook, loginWithGoogle } = this.props
    return <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.connectWith}>Or connect with:</Text>
        <View style={styles.socialButtons}>
          <FbLoginButton onLoginFinished={loginWithFacebook} />
          <GoogleLoginButton onLoginFinished={loginWithGoogle} />
        </View>
        <View style={styles.login}>
          <Text style={styles.haveAccount}>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}><Text style={styles.loginButton}>Log in now</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  }
}
