import React from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './SignupControl.styles.js'
import EntypoIcon from 'react-native-vector-icons/Entypo'

export default class SignupControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {securePassword: true}
  }

  togglePassword () {
    this.setState({securePassword: !this.state.securePassword})
  }

  render () {
    const {
      label, value, onChange, togglableSecureTextEntry, keyboardType, autoCapitalize, autoCorrect, style
    } = this.props

    const { securePassword } = this.state

    return <View style={[styles.control, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={onChange}
        value={value}
        secureTextEntry={togglableSecureTextEntry && securePassword}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType} />
      {togglableSecureTextEntry && <EntypoIcon name={this.state.securePassword ? 'eye' : 'eye-with-line'}
        style={styles.icon}
        onPress={() => this.togglePassword()} />}
    </View>
  }
}
