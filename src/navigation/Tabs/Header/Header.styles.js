import { StyleSheet } from 'react-native'
import { white } from 'style/colors'
// import { isIOS } from 'util/platform'


export const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    color: white,
    fontFamily: 'Circular-Bold',
    fontSize: 18,
    fontWeight: '200'
  },
  // // Follow:
  // // https://github.com/react-navigation/react-navigation/issues/7057#issuecomment-593086348
  // headerTitleContainerStyle: {
  //   width: isIOS ? '40%' : '75%',
  //   alignItems: isIOS ? 'center' : 'flex-start'
  // },
  icon: {
    opacity: 0.75,
    color: white,
    backgroundColor: 'transparent',
    fontSize: 32,
    marginRight: 12
  }
})

export default styles
