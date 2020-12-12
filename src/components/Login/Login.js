import React from 'react'
import NetInfo from '@react-native-community/netinfo'
import { get } from 'lodash/fp'
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { isIOS } from 'util/platform'
import validator from 'validator'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import AppleLoginButton from './AppleLoginButton'
import FbLoginButton from './FbLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import styles from './Login.styles'

export default class Login extends React.Component {
  static navigationOptions = {
    headerShown: false
  }

  constructor (props) {
    super(props)
    this.state = {
      email: this.props.defaultEmail,
      securePassword: true,
      emailIsValid: false,
      isConnected: true
    }
  }

  login = () => {
    this.props.login(this.state.email, this.state.password)
  }

  createErrorNotification = (error) => {
    this.setState({ ssoError: error })
  }

  togglePassword = () => {
    this.setState({
      securePassword: !this.state.securePassword
    })
  }

  validateEmail (email) {
    this.setState({
      emailIsValid: validator.isEmail(email)
    })
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
    if (key === 'email') {
      this.validateEmail(value)
    }
  }

  async UNSAFE_componentWillMount () {
    const { loginToken, loginByToken } = this.props
    if (loginToken) {
      const loginByTokenResponse = await loginByToken()
      const errorMessage = get('errorMessage', loginByTokenResponse)
      if (errorMessage) this.createErrorNotification(errorMessage)
    }
  }

  componentDidMount () {
    this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleConnectivityChange)
  }

  componentWillUnmount () {
    this.unsubscribeNetInfo()
  }

  handleConnectivityChange = ({ isConnected }) => {
    if (isConnected !== this.state.isConnected) this.setState({ isConnected })
  }

  render () {
    const {
      loginWithApple, loginWithFacebook, loginWithGoogle,
      formError, pending, goToResetPassword, goToSignup,
      bannerMessage
    } = this.props
    const { ssoError, emailIsValid, isConnected } = this.state

    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.login} style={styles.container}>
          {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
          {!isConnected && <Text style={styles.errorBanner}>OFFLINE; TRYING TO RECONNECT...</Text>}
          {pending && <Text style={styles.banner}>LOGGING IN...</Text>}
          {bannerMessage && <Text style={styles.banner}>{bannerMessage}</Text>}

          <Image
            style={styles.logo}
            source={require('../../assets/merkaba-green-on-white.png')}
          />
          <Text style={styles.title}>Log in to Hylo</Text>
          {formError && <FormError />}
          {!formError && <View style={styles.labelRow}>
            <Text style={styles.labelText}>Your email address</Text>
          </View>}
          <View style={styles.paddedRow}>
            <View style={emailIsValid ? styles.paddedBorderValid : styles.paddedBorder}>
              <View style={styles.leftInputView}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={email => this.setInput('email', email)}
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='email-address'
                  // UPGRADE TODO: Fix with this: https://stackoverflow.com/a/59626713
                  // onSubmitEditing={() => focus(this.passwordInput)}
                  underlineColorAndroid={styles.androidInvisibleUnderline}
                />
              </View>
              <View style={styles.rightIconView}>
                {emailIsValid && <EntypoIcon
                  name='check'
                  style={styles.iconGreen}
                                 />}
              </View>
            </View>
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.labelText}>Password</Text>
            <TouchableOpacity onPress={goToResetPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paddedRow}>
            <View style={styles.paddedBorder}>
              <View style={styles.leftInputView}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={this.state.securePassword}
                  autoCapitalize='none'
                  ref={ref => { this.passwordInput = ref }}
                  onChangeText={password => this.setInput('password', password)}
                  returnKeyType='go'
                  selectTextOnFocus
                  onSubmitEditing={() => this.login()}
                  underlineColorAndroid='rgba(0,0,0,0)'
                />
              </View>
              <View style={styles.rightIconView}>
                <EntypoIcon
                  name={this.state.securePassword ? 'eye' : 'eye-with-line'}
                  style={styles.iconOpaque}
                  onPress={this.togglePassword}
                />
              </View>
            </View>
          </View>
          <View style={styles.paddedRow}>
            <TouchableOpacity onPress={this.login} style={styles.loginButton}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.connectWith}>
            <Text style={styles.connectWithText}>Or connect with:</Text>
            {/* {isIOS && <AppleLoginButton
              style={styles.appleLoginButton}
              onLoginFinished={loginWithApple}
              createErrorNotification={this.createErrorNotification}
            />} */}
            <GoogleLoginButton
              style={styles.googleLoginButton}
              onLoginFinished={loginWithGoogle}
              createErrorNotification={this.createErrorNotification}
            />
            <FbLoginButton
              style={styles.facebookLoginButton}
              onLoginFinished={loginWithFacebook}
              createErrorNotification={this.createErrorNotification}
            />
          </View>
          <SignupLink goToSignup={goToSignup} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export function SignupLink ({ goToSignup }) {
  return (
    <View style={styles.signup}>
      <Text style={styles.signupText}>Dont have an account? </Text>
      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.signupLink}>Sign up now</Text>
      </TouchableOpacity>
    </View>
  )
}

export function FormError () {
  const rowStyle = styles.emailErrorRow
  const triangleStyle = styles.emailTriangle
  const message = 'Username or Password was incorrect'
  return (
    <View style={styles.errorView}>
      <View style={rowStyle}>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
      <View style={triangleStyle} />
    </View>
  )
}
