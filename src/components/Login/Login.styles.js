import { StyleSheet } from 'react-native'
import { caribbeanGreen } from 'style/colors'

const mixins = {
  textInput: {
    width: 288,
    height: 40,
    marginBottom: 10
  },
  loginContainer: {
    width: 162,
    height: 36,
    backgroundColor: 'lightgray',
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5
  },
  icon: {
    marginRight: 24,
    fontSize: 20,
    marginTop: 10
  }
}

export default {
  logo: {
    height: 80,
    width: 80,
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    color: caribbeanGreen,
    marginBottom: 24,
    fontWeight: '600'
  },
  iconOpaque: {
    ...mixins.icon,
    opacity: 0.5
  },
  iconGreen: {
    ...mixins.icon,
    color: caribbeanGreen
  },
  login: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  facebookLoginContainer: {
    ...mixins.loginContainer,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50
  },
  googleLoginContainer: {
    ...mixins.loginContainer,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50
  },
  emailInput: {
    ...mixins.textInput
  },
  emailInputWithoutIcon: {
    ...mixins.textInput,
    width: 332
  },
  passwordInput: {
    ...mixins.textInput
  },
  passwordView: {
    marginTop: 12
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  signup: {
    marginTop: 24,
    flexDirection: 'row'
  },
  signupText: {
    color: caribbeanGreen,
    fontWeight: '600'
  },
  loginButton: {
    backgroundColor: caribbeanGreen,
    height: 36,
    borderRadius: 50,
    width: 324,
    justifyContent: 'center',
    marginTop: 48
  },
  loginText: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '500'
  },
  connectWith: {
    marginTop: 12,
    marginBottom: 12,
    opacity: 0.5
  },
  loginButtons: {
    flexDirection: 'row',
    opacity: 0.7
  },
  label: {
    marginBottom: 12
  },
  inputWithIcon: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    height: 40
  },
  inputWithIconValid: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    height: 40,
    borderColor: caribbeanGreen
  },
  heavyText: {
    fontWeight: '500'
  },
  accountText: {
    fontWeight: '500',
    opacity: 0.7
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
