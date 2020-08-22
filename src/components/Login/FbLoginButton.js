import React from 'react'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import Button from 'components/Button'

export const permissions = ['public_profile', 'user_friends', 'email']

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
      this.props.createErrorNotification('COULD NOT SIGN IN WITH YOUR FACEBOOK ACCOUNT')
    } else {
      return this.AccessToken.getCurrentAccessToken()
      .then(data => onLoginFinished(data.accessToken.toString()))
    }
  }

  signIn = () => {
    return this.LoginManager.logInWithPermissions(permissions)
    .then(
      result => result.isCancelled || this.handleResult(null, result)
    )
    .catch(() => {
      this.props.createErrorNotification('COULD NOT SIGN IN WITH YOUR FACEBOOK ACCOUNT')
    })
  }

  render () {
    const style = {
      fontSize: 16,
      width: 160,
      height: 35,
      backgroundColor: '#1877F2',
      ...this.props.style
  }
    const iconStyle = {
      fontSize: 13,
      ...this.props.iconStyle
    }

    return <Button
      onPress={this.signIn}
      iconName='Facebook'
      style={style}
      iconStyle={iconStyle}>Facebook</Button>
  }
}
