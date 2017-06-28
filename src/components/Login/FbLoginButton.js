import React from 'react'
import PropTypes from 'prop-types'
import { LoginButton, AccessToken } from 'react-native-fbsdk'

export default class FbLoginButton extends React.Component {
  static propTypes = {
    onLoginFinished: PropTypes.func.isRequired
  }

  handleResult = (error, result) => {
    const { onLoginFinished } = this.props
    if (error) {
      // alert('Login failed with error: ' + result.error);
    } else {
      AccessToken.getCurrentAccessToken()
      .then(data => onLoginFinished(data.accessToken.toString()))
    }
  }

  render () {
    return <LoginButton
      readPermissions={['public_profile', 'user_friends', 'email']}
      onLoginFinished={this.handleResult} />
  }
}
