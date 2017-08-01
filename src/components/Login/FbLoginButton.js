import React from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import { AccessToken, LoginManager } from 'react-native-fbsdk'

import Icon from '../Icon'
import styles from './Login.styles'

export default class FbLoginButton extends React.Component {
  handleResult = (error, result) => {
    const { onLoginFinished } = this.props
    if (error) {
      alert('Login failed with error: ' + result.error)
    } else {
      AccessToken.getCurrentAccessToken()
      .then(data => onLoginFinished(data.accessToken.toString()))
    }
  }

  signIn = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          alert('Login was cancelled')
        } else {
          this.handleResult()
        }
      },
      function (error) {
        alert('Login failed with error: ' + error)
      }
    )
  }

  render () {
    return <View style={styles.facebookLoginContainer}>
      <TouchableOpacity onPress={this.signIn}>
        <Text style={styles.heavyText}><Icon name='Facebook' size={12} />  Facebook</Text>
      </TouchableOpacity>
    </View>
  }
}
