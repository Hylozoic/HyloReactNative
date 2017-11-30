import { caribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'

const gray = '#929292'

export default {
  tabNavigatorAndroid: {
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  tabNavigatorIOS: {
    backgroundColor: 'white'
  },
  icon: {
    marginBottom: isIOS ? 27 : 0,
    paddingTop: isIOS ? 0 : 5
  },
  labelView: {
    height: 16
  },
  labelText: {
    textAlign: 'center',
    fontSize: 11,
    color: gray
  },
  activeTab: {
    color: caribbeanGreen
  },
  inactiveTab: {
    color: gray
  }
}
