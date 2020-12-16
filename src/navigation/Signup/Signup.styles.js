import { Dimensions } from 'react-native'
import loginStyles from 'navigation/Login/Login.styles'
import { caribbeanGreen } from 'style/colors'

const bgImageWidth = Dimensions.get('window').width
const bgImageHeight = bgImageWidth * 0.6

export default {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  banner: loginStyles.banner,
  errorBanner: loginStyles.errorBanner,
  background: {
    width: bgImageWidth,
    height: bgImageHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    width: bgImageWidth,
    height: bgImageHeight,
    resizeMode: 'cover'
  },
  merkabaImage: {
    height: 97,
    width: 97
  },
  paddedContainer: {
    paddingVertical: 35,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  },
  title: {
    ...loginStyles.title,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 12
  },
  errorWrapper: {
    alignItems: 'center'
  },
  error: loginStyles.error,
  subTitle: {
    ...loginStyles.helpText,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 25
  },
  signupButton: {
    height: 45,
    fontSize: 16,
    marginBottom: 10
  },

  // Connect with
  connectWith: loginStyles.connectWith,
  connectWithText: loginStyles.connectWithText,
  appleLoginButton: {
    ...loginStyles.appleLoginButton,
    width: '80%'
  },
  googleLoginButton: {
    ...loginStyles.googleLoginButton,
    width: '80%'
  },
  facebookLoginButton: {
    ...loginStyles.facebookLoginButton,
    width: '80%'
  },

  login: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  haveAccount: {
    ...loginStyles.helpText
  },
  loginButton: {
    ...loginStyles.helpText,
    color: caribbeanGreen,
    fontFamily: 'Circular-Book'
  },
  terms: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  termsText: {
    fontSize: 12
  }
}
