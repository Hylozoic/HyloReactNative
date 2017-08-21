import React from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import { GoogleSignin } from 'react-native-google-signin'

import Icon from '../Icon'
import styles from './Login.styles'

export default class GoogleLoginButton extends React.Component {
  componentDidMount () {
    GoogleSignin.configure({
      iosClientId: process.env.IOS_GOOGLE_CLIENT_ID,
      webClientId: process.env.WEB_GOOGLE_CLIENT_ID
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
    return <View style={styles.googleLoginContainer}>
      <TouchableOpacity onPress={this.signIn}>
        <Text style={styles.heavyText}><Icon name='Google' size={12} />  Google</Text>
      </TouchableOpacity>
    </View>
  }
}
