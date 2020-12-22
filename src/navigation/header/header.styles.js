import { white, rhino80, black10onRhino, black10OnCaribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'

export default StyleSheet.create({
  headerStyle: {
    backgroundColor: rhino80
    // backgroundColor: black10onRhino
    // backgroundColor: black10OnCaribbeanGreen
  },
  headerTitleContainerStyle: {
    // // Follow: https://github.com/react-navigation/react-navigation/issues/7057#issuecomment-593086348
    // width: isIOS ? '40%' : '75%',
    // alignItems: isIOS ? 'center' : 'flex-start'
    marginLeft: isIOS ? 0 : 10
  },
  headerTitleStyle: {
    color: white,
    fontFamily: 'Circular-Bold',
    fontSize: 18,
    fontWeight: '200'
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    opacity: 0.75,
    color: white,
    backgroundColor: 'transparent',
    fontSize: 32,
    marginRight: 12
  }
})
