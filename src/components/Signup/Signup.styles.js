import Dimensions from 'Dimensions'
import loginStyles from '../Login/Login.styles'
import { caribbeanGreen } from 'style/colors'
const bgImageWidth = Dimensions.get('window').width
const bgImageHeight = bgImageWidth * 0.78

export default {
  container: {
    backgroundColor: 'white'
  },
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
  connectWith: {
    ...loginStyles.helpText,
    textAlign: 'center',
    marginBottom: 16
  },
  socialButtons: {
    flex: 1,
    flexDirection: 'row',
    opacity: 0.7,
    marginBottom: 30
  },
  login: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  haveAccount: {
    ...loginStyles.helpText
  },
  loginButton: {
    ...loginStyles.helpText,
    color: caribbeanGreen,
    fontFamily: 'Circular-Book'
  }
}
