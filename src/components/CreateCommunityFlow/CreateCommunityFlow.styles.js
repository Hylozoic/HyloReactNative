import { caribbeanGreen, white, white60onCaribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    backgroundColor: caribbeanGreen,
    resizeMode: 'cover'
  },
  header: {
    color: white,
    fontSize: 20,
    fontWeight: 'bold'
  },
  description: {
    color: white60onCaribbeanGreen
  }
})
