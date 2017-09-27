import React from 'react'
import {
  View,
  Text
} from 'react-native'
import SignupControl from '../SignupControl'
import Button from '../../Button'
import styles from './SignupFlow1.styles'
import { validateUser } from 'hylo-utils/validators'
import validator from 'validator'
import { any, values } from 'lodash/fp'

export default class SignupFlow1 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 1/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor,
    headerBackTitle: null
  })

  componentDidMount () {
    const { currentUser, fetchCurrentUser, loadUserSettings } = this.props
    fetchCurrentUser()

    // this is for the case where they logged in but hadn't finished sign up
    if (currentUser) {
      loadUserSettings()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.props.loadUserSettings()
    }
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
    const { name, email, password, showPasswordField } = this.props
    const errors = {
      name: validateUser.name(name),
      password: showPasswordField && validateUser.password(password),
      email: !validator.isEmail(email) && 'Must be a valid email'
    }
    this.setState({errors})
    return !any(i => i, values(errors))
  }

  submit () {
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
    const { name, email, password, pending, showPasswordField } = this.props
    const { errors } = this.state

    return <View style={styles.container}>
      <Text style={styles.title}>Howdie stranger!</Text>
      <Text style={styles.subTitle}>
        To kick things off, tell us a bit more about yourself and get your account off the ground.
      </Text>
      <SignupControl
        label='Your Full Name'
        value={name}
        onChange={value => this.updateField('name', value)}
        error={errors.name} />
      <SignupControl
        label='Email Address'
        value={email}
        keyboardType={'email-address'}
        autoCapitalize='none'
        autoCorrect={false}
        onChange={value => this.updateField('email', value)}
        error={errors.email} />
      {showPasswordField && <SignupControl
        label='Password'
        value={password}
        onChange={value => this.updateField('password', value)}
        togglableSecureTextEntry
        error={errors.password} />}
      <Button
        style={styles.continueButton}
        text={pending ? 'Saving...' : 'Continue'}
        onPress={() => this.submit()}
        disabled={!!pending} />
    </View>
  }
}
