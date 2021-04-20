import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import SettingControl from 'components/SettingControl'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import { validateUser } from 'hylo-utils/validators'
import validator from 'validator'
import { any, values } from 'lodash/fp'
import styles from './SignupFlow1.styles'

export default class SignupFlow1 extends React.Component {
  componentDidMount () {
    const { currentUser, loadUserSettings } = this.props
    // this is for the case where they logged in but hadn't finished sign up
    if (currentUser) loadUserSettings()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({
        errors: {
          ...this.state.errors,
          ...this.props.errors
        }
      })
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      errors: {
        name: null,
        email: null,
        password: null
      }
    }
    this.emailControlRef = React.createRef()
    this.passwordControlRef = React.createRef()
    this.confirmPasswordControlRef = React.createRef()
  }

  validate () {
    const { name, email, password, confirmPassword, showPasswordField } = this.props
    const errors = {
      name: validateUser.name(name),
      email: !validator.isEmail(email) && 'Must be a valid email',
      password: showPasswordField && validateUser.password(password),
      confirmPassword: password !== confirmPassword && 'Passwords must match'
    }
    this.setState({ errors })
    return !any(i => i, values(errors))
  }

  submit = () => {
    if (this.props.pending) return
    if (this.validate()) {
      this.props.signupOrUpdate()
    }
  }

  updateField (field, value) {
    this.setState({
      errors: {
        ...this.state.errors,
        [field]: null
      }
    })
    this.props.changeSetting(field, value)
  }

  render () {
    const { name, email, password, confirmPassword, pending, showPasswordField } = this.props
    const { errors } = this.state
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <KeyboardFriendlyView>
            <View style={styles.header}>
              <Text style={styles.title}>Hi there stranger!</Text>
              <Text style={styles.subTitle}>
                To kick things off, tell us a bit more about yourself and get your account off the ground.
              </Text>
            </View>
            <View style={styles.content}>
              <SettingControl
                label='Your Full Name'
                value={name}
                onChange={value => this.updateField('name', value)}
                error={errors.name}
                returnKeyType='next'
                onSubmitEditing={() => this.emailControlRef.current.focus()}
              />
              <SettingControl
                ref={this.emailControlRef}
                label='Email Address'
                value={email}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                onChange={value => this.updateField('email', value)}
                error={errors.email}
                returnKeyType='next'
                onSubmitEditing={() => this.passwordControlRef.current.focus()}
              />
              {showPasswordField && (
                <SettingControl
                  ref={this.passwordControlRef}
                  label='Password'
                  value={password}
                  onChange={value => this.updateField('password', value)}
                  toggleSecureTextEntry
                  error={errors.password}
                  returnKeyType='next'
                  onSubmitEditing={() => this.confirmPasswordControlRef.current.focus()}
                />
              )}
              {showPasswordField && (
                <SettingControl
                  ref={this.confirmPasswordControlRef}
                  label='Confirm Password'
                  value={confirmPassword}
                  onChange={value => this.updateField('confirmPassword', value)}
                  toggleSecureTextEntry
                  error={errors.confirmPassword}
                  returnKeyType='go'
                  onSubmitEditing={this.submit}
                />
              )}
            </View>
            <View style={styles.footer}>
              <Button
                style={styles.continueButton}
                text={pending ? 'Saving...' : 'Continue'}
                onPress={this.submit}
                disabled={!!pending}
              />
            </View>
          </KeyboardFriendlyView>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
