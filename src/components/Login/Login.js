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
    this.props.navigation.navigate('SignupFlow1')
  }

  render () {
    const { error, loginWithGoogle, loginWithFacebook, goToSignup } = this.props
    const emailIsValid = this.state.emailIsValid

    return <ScrollView contentContainerStyle={styles.login}>
      <Image style={styles.logo}
        source={require('../../assets/merkaba-green-on-white.png')} />
      <Text style={styles.title}>Log in to Hylo</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>Your email address</Text>
      </View>
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

      <View style={styles.paddedRow}>
        <View style={styles.paddedButton}>
          <TouchableOpacity onPress={() => this.login()}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>Log In</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.connectWith}>
        <Text style={styles.helpText}>Or connect with:</Text>
      </View>
      <View style={styles.paddedRowWithOpacity}>
        <FbLoginButton onLoginFinished={loginWithFacebook} />
        <GoogleLoginButton onLoginFinished={loginWithGoogle} />
      </View>
      <View style={styles.signup}>
        <Text style={styles.helpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={goToSignup}>
          <Text style={styles.signupText}>Sign up now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  }
}
