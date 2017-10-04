import React from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './SignupControl.styles.js'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import Triangle from 'react-native-triangle'

export default class SignupControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {securePassword: true}
  }

  togglePassword () {
    this.setState({securePassword: !this.state.securePassword})
  }

  focus () {
    this.input.focus()
  }

  render () {
    const {
      label,
      value,
      onChange,
      togglableSecureTextEntry,
      keyboardType,
      returnKeyType,
      onSubmitEditing,
      autoCapitalize,
      autoCorrect,
      style,
      error
    } = this.props

    const { securePassword } = this.state

    return <View style={[styles.control, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={c => { this.input = c }}
        style={styles.textInput}
        onChangeText={onChange}
        value={value}
        secureTextEntry={togglableSecureTextEntry && securePassword}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing} />
      {togglableSecureTextEntry && <EntypoIcon name={this.state.securePassword ? 'eye' : 'eye-with-line'}
        style={styles.icon}
        onPress={() => this.togglePassword()} />}
      {!!error && <View style={styles.errorWrapper}>
        <Triangle
          width={10}
          height={5}
          color='white'
          direction='up' />
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>}
    </View>
  }
}
