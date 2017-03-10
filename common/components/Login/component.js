import React, { PropTypes } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
import { vw } from '../../util/viewport'
import { focus } from '../../util/textInput'

export default class Login extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    defaultEmail: PropTypes.string,
    actions: PropTypes.shape({
      login: PropTypes.func.isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)
    this.state = {email: this.props.defaultEmail}
  }

  login () {
    this.props.actions.login(this.state.email, this.state.password)
  }

  render () {
    const { error, defaultEmail } = this.props

    return <ScrollView contentContainerStyle={styles.login}>
      <Text style={styles.title}>Hylo!</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View>{/* this wrapper view is needed to get TextInput to center-align */}
        <TextInput style={styles.email} placeholder='Email address'
          defaultValue={defaultEmail}
          onChangeText={email => this.setState({email})}
          returnKeyType='next'
          autoCapitalize='none'
          onSubmitEditing={() => focus(this.passwordInput)} />
      </View>
      <View>
        <TextInput style={styles.password} placeholder='Password'
          secureTextEntry
          ref={ref => { this.passwordInput = ref }}
          onChangeText={password => this.setState({password})}
          returnKeyType='go'
          selectTextOnFocus
          onSubmitEditing={() => this.login()} />
      </View>
      <Button onPress={() => this.login()} title='Log in' />
    </ScrollView>
  }
}

const mixins = {
  textInput: {
    width: 80 * vw,
    height: 40,
    marginBottom: 10
  }
}

const styles = {
  login: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  email: {
    ...mixins.textInput
  },
  password: {
    ...mixins.textInput
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
}
