import React from 'react'
import {
  View,
  Text
} from 'react-native'
import SignupControl from '../SignupControl'
import Button from '../../Button'
import styles from './SignupFlow1.styles'

export default class SignupFlow1 extends React.Component {

  render () {
    const { changeSetting, name, email, password } = this.props

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
        onChange={changeSetting('email')} />
      <SignupControl
        label='Password'
        value={password}
        onChange={changeSetting('password')}
        isPassword />
      <Button
        style={styles.continueButton}
        text='Continue'
        onPress={() => console.log('continue')} />

    </View>
  }
}
