import { Dimensions, StyleSheet } from 'react-native'
import { caribbeanGreen, rhino60 } from 'style/colors'
import { isIOS } from 'util/platform'

const screenHeight = Dimensions.get('window').height
const smallScreenFudge = screenHeight < 550 ? 0.6 : 1

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
    marginBottom: 11,
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
    marginTop: 12,
    marginLeft: 55,
    position: 'absolute'
  },
  banner: {
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: isIOS ? 20 : 0,
    zIndex: 2
  }
}

export default {
  container: {
    backgroundColor: 'white'
  },
  logo: {
    height: 80,
    width: 80,
    marginTop: (screenHeight - 480) * 0.6,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    color: caribbeanGreen,
    marginBottom: 20 * smallScreenFudge,
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
  signup: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row'
  },
  signupText: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Bold'
  },
  loginText: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: isIOS ? 32 : 28
  },
  connectWith: {
    marginTop: 4 * smallScreenFudge,
    marginBottom: 14 * smallScreenFudge
  },
  forgotPasswordText: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    color: caribbeanGreen
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
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: caribbeanGreen,
    height: 36,
    borderRadius: 50,
    justifyContent: 'center',
    marginTop: 22
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
  errorView: {
    alignSelf: 'stretch'
  },
  emailErrorRow: {
    alignSelf: 'stretch',
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#EE4266',
    padding: 10,
    marginBottom: 3,
    marginTop: -21,
    borderRadius: 30
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
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
