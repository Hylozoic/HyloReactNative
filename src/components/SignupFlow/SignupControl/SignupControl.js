import React from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './SignupControl.styles.js'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import Triangle from 'react-native-triangle'

export default class SignupControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      securePassword: true,
      editable: true,
      highlight: false
    }
  }

  componentDidMount () {
    if (this.props.toggleEditable) {
      this.setState({editable: false})
    }
  }

  togglePassword () {
    this.setState({securePassword: !this.state.securePassword})
  }

  toggleEditable () {
    if (this.state.editable) {
      this.onSubmitEditing()
    } else {
      this.setState({editable: true})
    }
  }

  focus () {
    this.input.focus()
  }

  makeEditable () {
    this.setState({editable: true})
  }

  isEditable () {
    return this.state.editable
  }

  onSubmitEditing () {
    if (this.props.toggleEditable) this.setState({editable: false})
    if (this.props.onSubmitEditing) this.props.onSubmitEditing()
    if (this.state.highlight) this.setState({highlight: false})
  }

  highlightCheck () {
    this.setState({highlight: true})
  }

  render () {
    const {
      label,
      value,
      onChange,
      toggleSecureTextEntry,
      toggleEditable,
      keyboardType,
      returnKeyType,
      autoCapitalize,
      autoCorrect,
      style,
      error
    } = this.props

    const { securePassword, editable, highlight } = this.state

    return <View style={[styles.control, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={c => { this.input = c }}
        style={styles.textInput}
        onChangeText={onChange}
        value={value}
        secureTextEntry={toggleSecureTextEntry && securePassword}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={() => this.onSubmitEditing()}
        editable={editable} />
      {(toggleSecureTextEntry || toggleEditable) && <View style={styles.toggles}>
        {toggleSecureTextEntry && <EntypoIcon name={securePassword ? 'eye' : 'eye-with-line'}
          style={styles.eyeIcon}
          onPress={() => this.togglePassword()} />}
        {toggleEditable && <View
          style={highlight && styles.highlight}>
          <EntypoIcon name={editable ? 'check' : 'edit'}
            style={styles.editIcon}
            onPress={() => this.toggleEditable()} />
        </View>}
      </View>}
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
