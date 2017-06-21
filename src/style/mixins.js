import { Platform } from 'react-native'
const isIOS = Platform.OS === 'ios'

export default {
  allCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  navigationText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 42
  },

  belowStatusBar: {
    paddingTop: isIOS ? 20 : 0
  },

  belowNavigationBar: {
    marginTop: 80
  },

  justBelowNavigationBar: {
    marginTop: 64
  }
}
