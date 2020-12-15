import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    alignSelf: 'center',
    color: 'black',
    flex: 1,
    fontFamily: 'Circular-Bold',
    fontSize: 18,
    fontWeight: '200',
    textAlign: 'center'
  },
  icon: {
    opacity: 0.75,
    backgroundColor: 'transparent',
    fontSize: 32,
    marginRight: 12
  }
})

export default styles
