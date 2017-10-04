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

  createErrorNotification = (error) => {
    this.setState({ssoError: error})
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

  componentWillReceiveProps = (nextProps) => {
    nextProps.error && this.setState({ssoError: null})
  }

  render () {
    const { loginWithGoogle, loginWithFacebook, error, emailError, passwordError, pending, goToSignup } = this.props
    const { ssoError } = this.state
    const emailIsValid = this.state.emailIsValid
    return <ScrollView contentContainerStyle={styles.login} style={styles.container}>
      {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
      {pending && <Text style={styles.banner}>Logging in ...</Text>}

      <Image style={styles.logo}
        source={require('../../assets/merkaba-green-on-white.png')} />
      <Text style={styles.title}>Log in to Hylo</Text>
      {emailError && <EmailError message={error} />}
      {!emailError && <View style={styles.labelRow}>
        <Text style={styles.labelText}>Your email address</Text>
      </View>}
      <View style={styles.paddedRow}>
        <View style={emailIsValid ? styles.paddedBorderValid : styles.paddedBorder}>
          <View style={styles.leftInputView}>
            <TextInput
              style={styles.textInput}
              onChangeText={email => this.setAndValidateEmail(email)}
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
              onSubmitEditing={() => focus(this.passwordInput)}
              underlineColorAndroid={styles.androidInvisibleUnderline} />
          </View>
          <View style={styles.rightIconView}>
            { emailIsValid && <EntypoIcon name='check'
              style={styles.iconGreen}
            /> }
          </View>
        </View>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.labelText}>Password</Text>
      </View>
      <View style={styles.paddedRow}>
        <View style={styles.paddedBorder}>
          <View style={styles.leftInputView}>
            <TextInput style={styles.textInput}
              secureTextEntry={this.state.securePassword}
              ref={ref => { this.passwordInput = ref }}
              onChangeText={password => this.setState({password})}
              returnKeyType='go'
              selectTextOnFocus
              onSubmitEditing={() => this.login()}
              underlineColorAndroid={'rgba(0,0,0,0)'} />
          </View>
          <View style={styles.rightIconView}>
            <EntypoIcon name={this.state.securePassword ? 'eye' : 'eye-with-line'}
              style={styles.iconOpaque}
              onPress={() => this.togglePassword()}
            />
          </View>
        </View>
      </View>
      {passwordError && <PasswordError message={error} />}
      <View style={styles.paddedRow}>
        <View style={styles.loginButton}>
          <TouchableOpacity onPress={() => this.login()}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.connectWith}>
        <Text style={styles.helpText}>Or connect with:</Text>
      </View>
      <View style={styles.paddedRowWithOpacity}>
        <FbLoginButton
          onLoginFinished={loginWithFacebook}
          createErrorNotification={this.createErrorNotification}
        />
        <GoogleLoginButton
          onLoginFinished={loginWithGoogle}
          createErrorNotification={this.createErrorNotification}
          />
      </View>
      <View style={styles.signup}>
        <Text style={styles.helpText}>Dont have an account? </Text>
        <TouchableOpacity onPress={goToSignup}>
          <Text style={styles.signupText}>Sign up now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  }
}

export function EmailError ({message}) {
  return <View style={styles.errorView}>
    <View style={styles.emailErrorRow}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
    <View style={styles.emailTriangle} />
  </View>
}

export function PasswordError ({message}) {
  return <View style={styles.errorView}>
    <View style={styles.passwordErrorRow}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
    <View style={styles.passwordTriangle} />
  </View>
}
