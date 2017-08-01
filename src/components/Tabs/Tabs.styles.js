import { jade } from 'style/colors'
import { StyleSheet } from 'react-native'

export default {
  tabNavigatorAndroid: {
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  tabNavigatorIOS: {
    backgroundColor: 'white'
  },
  activeTab: {
    textAlign: 'center',
    color: jade
  },
  inactiveTab: {
    textAlign: 'center'
  }
}
