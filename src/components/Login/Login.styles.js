import { Dimensions, StyleSheet } from 'react-native'
import { caribbeanGreen, rhino60 } from 'style/colors'

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
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row'
  }
}

export default {
  container: {
    backgroundColor: 'white'
  },
  logo: {
    height: 80,
    width: 80,
    marginTop: Math.pow(Dimensions.get('window').height, 1.01) / 7,
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    color: caribbeanGreen,
    marginBottom: 24,
    fontFamily: 'Circular-Bold'
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
    marginTop: 12,
    marginBottom: 30,
    flexDirection: 'row'
  },
  signupText: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Bold'
  },
  loginButton: {
    marginTop: 7,
    marginBottom: 16
  },
  loginText: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18
  },
  connectWith: {
    marginTop: 10,
    marginBottom: 16
  },
  helpText: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    color: rhino60
  },
  paddedRow: mixins.paddedRow,
  paddedRowWithOpacity: {
    ...mixins.paddedRow,
    opacity: 0.7
  },
  labelRow: {
    ...mixins.paddedRow,
    marginBottom: 4,
    justifyContent: 'flex-start'
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
    marginTop: 24
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
    borderRadius: 5,
    paddingLeft: 10
  },
  textInput: {
    height: 38,
    marginTop: 2
  },
  labelText: {
    fontFamily: 'Circular-Book',
    textAlign: 'left',
    flex: 1
  },
  rightIconView: {
    height: 40,
    flex: 0.1,
    borderRadius: 5
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)',
  bottomPad: {
    flex: 1
  }
}
