import { Dimensions, StyleSheet } from 'react-native'
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
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row',
    zIndex: 0
  },
  triangle: {
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 15,
    borderLeftWidth: 15,
    borderTopColor: '#EE4266',
    borderRightColor: 'transparent',
    borderBottomColor: '#EE4266',
    borderLeftColor: 'transparent',
    paddingBottom: -10,
    marginTop: -10,
    marginRight: 200
  },
  banner: {
    color: 'white',
    padding: 10,
    width: 500,
    textAlign: 'center',
    position: 'absolute',
    top: 0
  }
}

export default {
  logo: {
    height: 80,
    width: 80,
    marginTop: Math.pow(Dimensions.get('window').height, 1.01) / 8,
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
    marginTop: 7
  },
  loginText: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18
  },
  connectWith: {
    marginTop: 2,
    paddingBottom: 10,
    opacity: 0.5
  },
  heavyText: {
    fontFamily: 'Circular-Book'
  },
  accountText: {
    fontFamily: 'Circular-Book',
    opacity: 0.7
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
  emailErrorRow: {
    alignSelf: 'stretch',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#EE4266',
    padding: 10,
    marginBottom: 3,
    marginTop: -21,
    borderRadius: 30
  },
  passwordErrorRow: {
    alignSelf: 'stretch',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#EE4266',
    padding: 10,
    marginBottom: -32,
    borderRadius: 30,
    marginTop: -7,
    zIndex: 1
  },
  errorMessage: {
    color: 'white',
    textAlign: 'center'
  },
  errorBanner: {
    ...mixins.banner,
    backgroundColor: '#EE4266'
  },
  banner: {
    ...mixins.banner,
    backgroundColor: '#33D089'
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
  emailTriangle: {
    ...mixins.triangle,
    borderTopWidth: 10,
    borderBottomWidth: 0
  },
  passwordTriangle: {
    ...mixins.triangle,
    borderTopWidth: 0,
    borderBottomWidth: 10
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
