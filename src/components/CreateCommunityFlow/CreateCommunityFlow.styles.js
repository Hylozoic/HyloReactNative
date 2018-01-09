import { caribbeanGreen, white, white80onCaribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'

export default {
  container: {
    backgroundColor: caribbeanGreen,
    padding: 20,
    flex: 1
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
    width: 134,
    height: 40,
    fontSize: 16,
    backgroundColor: 'white',
    color: caribbeanGreen,
    position: 'absolute',
    right: 20,
    bottom: 20
  },
  textInputContainer: {
    marginTop: 100
  },
  textInputLabel: {
    color: white80onCaribbeanGreen,
    fontWeight: 'bold'
  },
  textInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: white80onCaribbeanGreen,
    minHeight: 40,
    color: white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
