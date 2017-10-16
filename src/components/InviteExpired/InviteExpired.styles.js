import {
  rhino60,
  caribbeanGreen
} from '../../style/colors'
import { isIOS } from 'util/platform'

const mixins = {
  paddedRow: {
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row',
    zIndex: 0
  }
}

export default {
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 100
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 52
  },
  headerText: {
    color: rhino60,
    fontSize: 24,
    fontFamily: 'Circular-Bold',
    textAlign: 'center'
  },
  image: {
    width: 288,
    height: 309,
    marginBottom: 25,
    marginTop: 25
  },
  goToLoginButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: caribbeanGreen,
    height: 36,
    borderRadius: 50,
    justifyContent: 'center',
    marginTop: 22
  },
  goToLoginButtonText: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: isIOS ? 32 : 28
  },
  paddedRow: mixins.paddedRow,
  paddedRowWithOpacity: {
    ...mixins.paddedRow,
    opacity: 0.7
  }
}
