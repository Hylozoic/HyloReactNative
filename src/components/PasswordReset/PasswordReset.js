import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
// import { focus } from '../../util/textInput'
import styles from './PasswordReset.styles'

export default class PasswordReset extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      securePassword: true,
      password: null,
      passwordConfirmation: null
    }
  }

  submit = () => {
    this.props.updatePassword(this.state.password)
  }

  togglePassword = () => {
    this.setState({
      securePassword: !this.state.securePassword
    })
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  render () {
    const { error } = this.props
    const { password, passwordConfirmation } = this.state

    const matching = password === passwordConfirmation
    const canSave = password && password.length > 8 && matching
    // const matchError = !isEmpty(password) && !matching

    return <ScrollView contentContainerStyle={styles.passwordReset} style={styles.container}>
      <Text style={styles.title}>Change Your Password</Text>
      {error && <FormError />}
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>New password</Text>
      </View>
      <View style={styles.paddedRow}>
        <View style={styles.paddedBorder}>
          <View style={styles.leftInputView}>
            <TextInput style={styles.textInput}
              secureTextEntry={this.state.securePassword}
              ref={ref => { this.passwordInput = ref }}
              onChangeText={password => this.setInput('password', password)}
              returnKeyType='go'
              selectTextOnFocus
              onSubmitEditing={() => this.submit()}
              underlineColorAndroid={'rgba(0,0,0,0)'} />
          </View>
          <View style={styles.rightIconView}>
            <EntypoIcon name={this.state.securePassword ? 'eye' : 'eye-with-line'}
              style={styles.iconOpaque}
              onPress={this.togglePassword}
            />
          </View>
        </View>
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>New password again</Text>
      </View>
      <View style={styles.paddedRow}>
        <View style={styles.paddedBorder}>
          <View style={styles.leftInputView}>
            <TextInput style={styles.textInput}
              secureTextEntry={this.state.securePassword}
              ref={ref => { this.passwordConfirmationInput = ref }}
              onChangeText={password => this.setInput('passwordConfirmation', password)}
              returnKeyType='go'
              selectTextOnFocus
              onSubmitEditing={() => this.submit()}
              underlineColorAndroid={'rgba(0,0,0,0)'} />
          </View>
          <View style={styles.rightIconView}>
            <EntypoIcon name={this.state.securePassword ? 'eye' : 'eye-with-line'}
              style={styles.iconOpaque}
              onPress={this.togglePassword}
            />
          </View>
        </View>
      </View>
      <View style={styles.paddedRow}>
        <TouchableOpacity onPress={this.submit} disabled={!canSave} style={styles.passwordResetButton}>
          <Text style={styles.passwordResetText}>Create Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  }
}

export function FormError () {
  const rowStyle = styles.emailErrorRow
  const triangleStyle = styles.emailTriangle
  const message = 'Password is invalid or unknown error'
  return <View style={styles.errorView}>
    <View style={rowStyle}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
    <View style={triangleStyle} />
  </View>
}
