import React from 'react'
import {
  View,
  Text
} from 'react-native'
import SignupControl from '../SignupControl'
import Button from '../../Button'
import styles from './SignupFlow1.styles'

export default class SignupFlow1 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 1/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor
  })

  render () {
    const { changeSetting, name, email, password, signup } = this.props

    return <View style={styles.container}>
      <Text style={styles.title}>Howdie stranger!</Text>
      <Text style={styles.subTitle}>
        To kick things off, tell us a bit more about yourself and get your account off the ground.
      </Text>
      <SignupControl
        label='Your Full Name'
        value={name}
        onChange={changeSetting('name')} />
      <SignupControl
        label='Email Address'
        value={email}
        keyboardType={'email-address'}
        autoCapitalize='none'
        autoCorrect={false}
        onChange={changeSetting('email')} />
      <SignupControl
        label='Password'
        value={password}
        onChange={changeSetting('password')}
        secureTextEntry />
      <Button
        style={styles.continueButton}
        text='Continue'
        onPress={signup} />
    </View>
  }
}
