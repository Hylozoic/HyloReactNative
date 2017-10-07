import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  NetInfo
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

  componentWillReceiveProps (nextProps) {
    const { error, emailError, passwordError } = nextProps
    this.setState({
      error,
      emailError,
      passwordError
    })
  }

  componentDidMount () {
    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange)
  }

  componentWillUnmount () {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange)
  }

  handleConnectivityChange = isConnected => {
    if (isConnected !== this.state.isConnected) this.setState({ isConnected })
  }

  render () {
    const { loginWithGoogle, loginWithFacebook, pending, goToSignup } = this.props
    const { ssoError, error, emailError, passwordError, emailIsValid, isConnected } = this.state
    return <ScrollView contentContainerStyle={styles.login} style={styles.container}>
      {ssoError && <Text style={styles.errorBanner}>{ssoError}</Text>}
      {!isConnected && <Text style={styles.errorBanner}>YOU ARE OFFLINE. TRYING TO RECONNECT...</Text>}
      {pending && <Text style={styles.banner}>Logging in ...</Text>}

      <Image style={styles.logo}
        source={require('../../assets/merkaba-green-on-white.png')} />
      <Text style={styles.title}>Log in to Hylo</Text>
      {emailError && <FormError message={error} position={'top'} />}
      {!emailError && <View style={styles.labelRow}>
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
              onChangeText={password => this.setInput('password', password)}
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
      {passwordError && <FormError message={error} position={'bottom'} />}
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

export function FormError ({message, position}) {
  const rowStyle = position === 'top' ? styles.emailErrorRow : styles.passwordErrorRow
  const triangleStyle = position === 'top' ? styles.emailTriangle : styles.passwordTriangle
  return <View style={styles.errorView}>
    <View style={rowStyle}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
    <View style={triangleStyle} />
  </View>
}
