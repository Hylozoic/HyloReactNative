import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { GoogleSignin } from 'react-native-google-signin'
import Icon from '../Icon'
import styles from './Login.styles'

export default class GoogleLoginButton extends React.Component {
  constructor (props) {
    super(props)
    if (props.mocks) {
      this.GoogleSignin = props.mocks.GoogleSignin
    } else {
      this.GoogleSignin = GoogleSignin
    }
  }
  componentDidMount () {
    this.GoogleSignin.configure({
      iosClientId: process.env.IOS_GOOGLE_CLIENT_ID,
      webClientId: process.env.WEB_GOOGLE_CLIENT_ID
    })
  }

  signIn = () => {
    const { onLoginFinished } = this.props
    return this.GoogleSignin.signIn()
    .then(user => onLoginFinished(user.accessToken))
    .catch(() => {
      this.props.createErrorNotification('COULD NOT SIGN IN WITH YOUR GOOGLE ACCOUNT')
    })
  }

  render () {
    return <TouchableOpacity style={styles.googleLoginContainer}
      onPress={this.signIn}>
      <Text style={styles.heavyText}>
        <Icon name='Google' size={12} />  Google
      </Text>
    </TouchableOpacity>
  }
}
