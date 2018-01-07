import { caribbeanGreen, white, white80onCaribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    backgroundColor: caribbeanGreen,
    padding: 20
  },
  header: {
    color: white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  description: {
    color: white80onCaribbeanGreen
  },
  button: {
    width: 30,
    backgroundColor: 'white'
  }
})
