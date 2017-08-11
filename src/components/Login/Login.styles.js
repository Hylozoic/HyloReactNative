import { StyleSheet } from 'react-native'
import { caribbeanGreen } from 'style/colors'

const mixins = {
  loginContainer: {
    height: 36,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    marginLeft: 1
  },
  icon: {
    fontSize: 20,
    marginTop: 10
  },
  paddedRow: {
    maxHeight: 40,
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row'
  }
}

export default {
  textInput: {
    height: 40,
    marginBottom: 10
  },
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  facebookLoginContainer: {
    ...mixins.loginContainer,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    flex: 0.5
  },
  googleLoginContainer: {
    ...mixins.loginContainer,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    flex: 0.5
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
    marginTop: 7
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
  heavyText: {
    fontWeight: '500'
  },
  accountText: {
    fontWeight: '500',
    opacity: 0.7
  },
  paddedRow: {
    ...mixins.paddedRow
  },
  paddedRowWithOpacity: {
    ...mixins.paddedRow,
    opacity: 0.7
  },
  paddedRowExtraMarginBottom: {
    ...mixins.paddedRow,
    marginBottom: 30
  },
  paddedRowLabel: {
    ...mixins.paddedRow,
    marginBottom: -8
  },
  paddedBorder: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    minHeight: 40
  },
  paddedButton: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 30,
    backgroundColor: caribbeanGreen,
    height: 36,
    borderRadius: 50,
    justifyContent: 'center',
    marginTop: 36,
    marginBottom: 36
  },
  paddedBorderValid: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    minHeight: 40,
    borderColor: caribbeanGreen
  },
  leftInputView: {
    height: 40,
    flex: 0.9,
    borderRadius: 5
  },
  label: {
    flex: 0.9,
    borderRadius: 5
  },
  rightIconView: {
    height: 40,
    flex: 0.1,
    borderRadius: 5
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
