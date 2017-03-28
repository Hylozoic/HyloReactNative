import React, { PropTypes } from 'react'
import { IOS_GOOGLE_CLIENT_ID, WEB_GOOGLE_CLIENT_ID } from 'react-native-dotenv'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'

export default class GoogleLoginButton extends React.Component {
  static propTypes = {
    onLoginFinished: PropTypes.func.isRequired
  }

  componentDidMount() {
    GoogleSignin.configure({
      iosClientId: IOS_GOOGLE_CLIENT_ID,
      webClientId: WEB_GOOGLE_CLIENT_ID
    })
  }

  signIn = () => {
    const { onLoginFinished } = this.props
    GoogleSignin.signIn()
    .then(user => onLoginFinished(user.accessToken))
    .catch((err) => {
      console.log('WRONG SIGNIN', err)
    })
  }

  render () {
    return <GoogleSigninButton
      style={{width: 48, height: 48}}
      size={GoogleSigninButton.Size.Icon}
      color={GoogleSigninButton.Color.Dark}
      onPress={this.signIn} />
  }
}
