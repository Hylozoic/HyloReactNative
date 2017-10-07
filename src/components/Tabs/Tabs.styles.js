import { caribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'

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
    paddingTop: 4
  },
  labelView: {
    height: 17
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
