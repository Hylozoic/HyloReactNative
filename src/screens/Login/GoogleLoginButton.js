import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Button from 'components/Button'

export default class GoogleLoginButton extends React.Component {
  static defaultProps = {
    style: {}
  }

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

  signIn = async () => {
    try {
      await this.GoogleSignin.hasPlayServices()
      await this.GoogleSignin.signIn()
      const { accessToken } = await this.GoogleSignin.getTokens()

      this.props.onLoginFinished(accessToken)
    } catch (error) {
      process.env.NODE_ENV !== 'test' && console.log('!!! error in GoogleLoginButton', error)
      this.props.createErrorNotification('COULD NOT SIGN IN WITH YOUR GOOGLE ACCOUNT')
    }
  }

  render () {
    const style = {
      fontSize: 16,
      width: 160,
      height: 40,
      borderRadius: 5,
      backgroundColor: '#dd4b39',
      ...this.props.style,
      icon: {
        fontSize: 16,
        marginRight: 3,
        ...this.props.style.icon ? this.props.style.icon : {}
      }
    }
    const text = this.props.signup
      ? 'Sign up with Google'
      : 'Sign in with Google'

    return (
      <Button
        onPress={this.signIn}
        iconName='Google'
        style={style}
        text={text}
      />
    )
  }
}
