import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { GoogleSignin } from '@react-native-community/google-signin'
import Button from 'components/Button'
import Icon from '../Icon'
import styles from './Login.styles'

export default class GoogleLoginButton extends React.Component {
  constructor (props) {
    super(props)
    this.GoogleSignin = props.mocks ? props.mocks.GoogleSignin : GoogleSignin
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
    const style = {
      fontSize: 16,
      width: 160,
      height: 35,
      backgroundColor: '#dd4b39',
      ...this.props.style
    }
    const iconStyle = {
      fontSize: 13,
      ...this.props.iconStyle
    }

    return <Button
      onPress={this.signIn}
      iconName='Google'
      style={style}
      iconStyle={iconStyle}>Google</Button>
  }
}
