import React, { PropTypes } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
import { vw } from '../../util/viewport'
import { focus } from '../../util/textInput'

export default class Login extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      login: PropTypes.func.isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)
    this.state = {} // TODO: remember email
  }

  setKeyInState (key) {
    return value => this.setState({[key]: value})
  }

  login () {
    this.props.actions.login(this.state.email, this.state.password)
  }

  render () {
    return <ScrollView contentContainerStyle={styles.login}>
      <Text style={styles.title}>Hylo!</Text>
      <View>{/* this wrapper view is needed to get TextInput to center-align */}
        <TextInput style={styles.email} placeholder='Email address'
          onChangeText={this.setKeyInState('email')}
          returnKeyType='next'
          onSubmitEditing={() => focus(this.passwordInput)} />
      </View>
      <View>
        <TextInput style={styles.password} placeholder='Password'
          secureTextEntry
          ref={ref => { this.passwordInput = ref }}
          onChangeText={this.setKeyInState('password')}
          returnKeyType='go'
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
  }
}
