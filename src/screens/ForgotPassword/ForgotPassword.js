import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native'
import validator from 'validator'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import styles from './ForgotPassword.styles'

export default class ForgotPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailIsValid: false
    }
  }

  submit = async () => {
    await this.props.resetPassword(this.state.email)
    await this.props.goToLogin(this.state.email)
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

  render () {
    const { error } = this.props
    const { emailIsValid } = this.state
    // const message = 'If your email address matched an account in our system, we sent you an email. Please check your inbox.'
    return (
      <ScrollView contentContainerStyle={styles.forgotPassword} style={styles.container}>
        <View style={styles.paddedRow}>
          <Text style={styles.messageText}>
            Enter your email address and we'll send you an email
            that lets you reset your password.
          </Text>
        </View>
        {error && <FormError />}
        {!error && <View style={styles.labelRow}>
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
        <View style={styles.paddedRow}>
          <TouchableOpacity onPress={this.submit} disabled={!emailIsValid} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

export function FormError () {
  const rowStyle = styles.emailErrorRow
  const triangleStyle = styles.emailTriangle
  const message = 'Password is invalid or unknown error'
  return (
    <View style={styles.errorView}>
      <View style={rowStyle}>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
      <View style={triangleStyle} />
    </View>
  )
}
