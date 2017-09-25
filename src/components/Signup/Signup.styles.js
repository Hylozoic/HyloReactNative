import Dimensions from 'Dimensions'
const bgImageWidth = Dimensions.get('window').width
const bgImageHeight = bgImageWidth * (1191 / 1498) // 1498 and 1191 are the width and height of the image asset
import loginStyles from '../Login/Login.styles'
import { caribbeanGreen } from 'style/colors'

export default {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  backgroundImage: {
    width: bgImageWidth,
    height: bgImageHeight,
    marginBottom: 35
  },
  merkabaImage: {

  },
  paddedContainer: {
    paddingHorizontal: 16
  },
  title: {
    ...loginStyles.title,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 12
  },
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
