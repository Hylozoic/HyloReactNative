import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import validator from 'validator'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import FbLoginButton from './FbLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import { focus } from '../../util/textInput'
import styles from './Login.styles'

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      email: this.props.defaultEmail,
      securePassword: true,
      emailIsValid: false
    }
  }

  login () {
    this.props.login(this.state.email, this.state.password)
  }

  togglePassword () {
    this.setState({
      securePassword: !this.state.securePassword
    })
  }

  validateEmail (email) {
    return validator.isEmail(email)
  }

  setAndValidateEmail (email) {
    this.setState({
      email,
      emailIsValid: this.validateEmail(email)
    })
  }

  componentDidMount () {
    this.props.navigation.navigate('SignupFlow3')
  }

  render () {
    const { error, loginWithGoogle, loginWithFacebook } = this.props
    const emailIsValid = this.state.emailIsValid

    return <ScrollView contentContainerStyle={styles.login}>
      <Image style={styles.logo} source={require('../../assets/Hylo_Logotype_Circle.png')} />
      <Text style={styles.title}>Log in to Hylo</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View>{/* this wrapper view is needed to get TextInput to center-align */}
        <Text style={styles.label}>Your email address</Text>
        <View style={emailIsValid ? styles.inputWithIconValid : styles.inputWithIcon}>
          <TextInput style={emailIsValid ? styles.emailInput : styles.emailInputWithoutIcon}
            onChangeText={email => this.setAndValidateEmail(email)}
            returnKeyType='next'
            autoCapitalize='none'
            keyboardType='email-address'
            onSubmitEditing={() => focus(this.passwordInput)}
            underlineColorAndroid={styles.androidInvisibleUnderline} />
          {emailIsValid && <EntypoIcon name='check'
            style={styles.iconGreen}
          />}
        </View>
      </View>
      <View style={styles.passwordView}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWithIcon}>
          <TextInput style={styles.passwordInput}
            secureTextEntry={this.state.securePassword}
            ref={ref => { this.passwordInput = ref }}
            onChangeText={password => this.setState({password})}
            returnKeyType='go'
            selectTextOnFocus
            onSubmitEditing={() => this.login()}
            underlineColorAndroid={'rgba(0,0,0,0)'} />
          <EntypoIcon name={this.state.securePassword ? 'eye' : 'eye-with-line'}
            style={styles.iconOpaque}
            onPress={() => this.togglePassword()}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => this.login()}>
        <View style={styles.loginButton}>
          <Text style={styles.loginText}>Log In</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.connectWith}>
        <Text style={styles.heavyText}>Or connect with:</Text>
      </View>
      <View style={styles.loginButtons}>
        <FbLoginButton onLoginFinished={loginWithFacebook} />
        <GoogleLoginButton onLoginFinished={loginWithGoogle} />
      </View>
      <View style={styles.signup}>
        <Text style={styles.accountText}>Dont have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signupText}>Sign up now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  }
}
