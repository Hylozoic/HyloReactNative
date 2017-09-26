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
    backTitle: null
  })

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
    const { name, email, password } = this.props
    const errors = {
      name: validateUser.name(name),
      password: validateUser.password(password),
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

  render () {
    const { changeSetting, name, email, password } = this.props
    const { errors } = this.state

    return <View style={styles.container}>
      <Text style={styles.title}>Howdie stranger!</Text>
      <Text style={styles.subTitle}>
        To kick things off, tell us a bit more about yourself and get your account off the ground.
      </Text>
      <SignupControl
        label='Your Full Name'
        value={name}
        onChange={changeSetting('name')}
        error={errors.name} />
      <SignupControl
        label='Email Address'
        value={email}
        keyboardType={'email-address'}
        autoCapitalize='none'
        autoCorrect={false}
        onChange={changeSetting('email')}
        error={errors.email} />
      <SignupControl
        label='Password'
        value={password}
        onChange={changeSetting('password')}
        togglableSecureTextEntry
        error={errors.password} />
      <Button
        style={styles.continueButton}
        text='Continue'
        onPress={() => this.submit()} />
    </View>
  }
}
