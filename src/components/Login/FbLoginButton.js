import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { AccessToken, LoginManager } from 'react-native-fbsdk'

import Icon from '../Icon'
import styles from './Login.styles'

const permissions = ['public_profile', 'user_friends', 'email']

export default class FbLoginButton extends React.Component {
  constructor (props) {
    super(props)
    if (props.mocks) {
      this.LoginManager = props.mocks.LoginManager
      this.AccessToken = props.mocks.AccessToken
    } else {
      this.LoginManager = LoginManager
      this.AccessToken = AccessToken
    }
  }

  handleResult = (error, result) => {
    const { onLoginFinished } = this.props
    if (error) {
      alert('Login failed with error: ' + result.error)
    } else {
      return this.AccessToken.getCurrentAccessToken()
      .then(data => onLoginFinished(data.accessToken.toString()))
    }
  }

  signIn = () => {
    return this.LoginManager.logInWithReadPermissions(permissions)
    .then(
      result => result.isCancelled || this.handleResult(null, result)
    )
    .catch(() => {
      this.props.createErrorNotification('COULD NOT SIGN IN WITH YOUR FACEBOOK ACCOUNT')
    })
  }

  render () {
    return <TouchableOpacity style={styles.facebookLoginContainer}
      onPress={this.signIn}>
      <Text style={styles.heavyText}>
        <Icon name='Facebook' size={12} />  Facebook
      </Text>
    </TouchableOpacity>
  }
}
