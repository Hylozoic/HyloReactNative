import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './SettingControl.styles.js'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import Triangle from 'react-native-triangle'

export default class SettingControl extends React.Component {
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
      this.setState({ editable: false })
    }
  }

  togglePassword = () => {
    this.setState({ securePassword: !this.state.securePassword })
  }

  toggleEditable = () => {
    if (this.state.editable) {
      this.onSubmitEditing()
    } else {
      this.setState({ editable: true })
    }
  }

  focus () {
    this.input.focus()
  }

  blur () {
    this.input.blur()
  }

  makeEditable () {
    this.setState({ editable: true })
  }

  isEditable () {
    return this.state.editable
  }

  onSubmitEditing = () => {
    if (this.props.toggleEditable) this.setState({ editable: false })
    if (this.props.onSubmitEditing) this.props.onSubmitEditing()
    if (this.state.highlight) this.setState({ highlight: false })
  }

  highlightCheck () {
    this.setState({ highlight: true })
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
      error,
      theme = {}
    } = this.props

    const { securePassword, editable, highlight } = this.state

    return (
      <View style={[styles.control, style, theme.control]}>
        <Text style={[styles.label, theme.label]}>{label}</Text>
        <TextInput
          ref={c => { this.input = c }}
          style={[styles.textInput, theme.textInput]}
          onChangeText={onChange}
          value={value}
          secureTextEntry={toggleSecureTextEntry && securePassword}
          textContentType='oneTimeCode'
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={this.onSubmitEditing}
          editable={editable}
        />
        {(toggleSecureTextEntry || toggleEditable) && (
          <View style={styles.toggles}>
            {toggleSecureTextEntry && (
              <TouchableOpacity
                onPress={this.togglePassword}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <EntypoIcon
                  name={securePassword ? 'eye' : 'eye-with-line'}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            )}
            {toggleEditable && (
              <View style={highlight && styles.highlight}>
                <TouchableOpacity
                  onPress={this.toggleEditable}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <EntypoIcon name={editable ? 'check' : 'edit'} style={styles.editIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!!error && (
          <View style={[styles.errorWrapper, theme.errorWrapper]}>
            {!theme.hideErrorTriangle && (
              <Triangle width={10} height={5} color='white' direction='up' />
            )}
            <View style={[styles.error, theme.error]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }
}
