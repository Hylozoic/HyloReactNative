import React from 'react'
import {
  Text,
  ScrollView
} from 'react-native'
import SettingControl from '../../SettingControl'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import styles from './SignupFlow1.styles'
import { validateUser } from 'hylo-utils/validators'
import validator from 'validator'
import { any, values } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class SignupFlow1 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 1/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor,
    headerBackTitle: null
  })

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

    const submitUnlessPending = pending
      ? () => {}
      : this.submit

    return (
      <KeyboardFriendlyView style={styles.container} {...kavProps}>
        <ScrollView>
          <Text style={styles.title}>Hi there stranger!</Text>
          <Text style={styles.subTitle}>
            To kick things off, tell us a bit more about yourself and get your account off the ground.
          </Text>
          <SettingControl
            label='Your Full Name'
            value={name}
            onChange={value => this.updateField('name', value)}
            error={errors.name}
            returnKeyType='next'
            onSubmitEditing={() => this.emailControl.focus()}
          />
          <SettingControl
            ref={c => { this.emailControl = c }}
            label='Email Address'
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            onChange={value => this.updateField('email', value)}
            error={errors.email}
            returnKeyType='next'
            onSubmitEditing={() => this.passwordControl.focus()}
          />
          {showPasswordField && <SettingControl
            ref={c => { this.passwordControl = c }}
            label='Password'
            value={password}
            onChange={value => this.updateField('password', value)}
            toggleSecureTextEntry
            error={errors.password}
            returnKeyType='next'
            onSubmitEditing={() => this.confirmPasswordControl.focus()}
                                />}
          {showPasswordField && <SettingControl
            ref={c => { this.confirmPasswordControl = c }}
            label='Confirm Password'
            value={confirmPassword}
            onChange={value => this.updateField('confirmPassword', value)}
            toggleSecureTextEntry
            error={errors.confirmPassword}
            returnKeyType='go'
            onSubmitEditing={submitUnlessPending}
                                />}
          <Button
            style={styles.continueButton}
            text={pending ? 'Saving...' : 'Continue'}
            onPress={submitUnlessPending}
            disabled={!!pending}
          />
        </ScrollView>
      </KeyboardFriendlyView>
    )
  }
}
