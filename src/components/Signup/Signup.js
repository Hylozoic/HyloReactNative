import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Button from '../Button'
const backgroundImage = require('../../assets/Sign_Up_Background.png')
// const merkabaImage = require('../../assets/merkaba_white.svg')
import styles from './Signup.styles'

export default class Signup extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    const { goToSignupFlow, goToLogin } = this.props
    return <ScrollView contentContainerStyle={styles.container}>
      <Image source={backgroundImage} resizeMode='stretch' style={styles.backgroundImage} />
      <View style={styles.paddedContainer}>
        <Text style={styles.title}>Sign up to get started with Hylo</Text>
        <Text style={styles.subTitle}>Stay connected, organized and engaged with your community.</Text>
        <Button text='Sign Up' style={styles.signupButton} onPress={goToSignupFlow} />
        <Text style={styles.connectWith}>Or connect with:</Text>
        <View style={styles.login}>
          <Text style={styles.haveAccount}>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}><Text style={styles.loginButton}>Log in now</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  }
}
