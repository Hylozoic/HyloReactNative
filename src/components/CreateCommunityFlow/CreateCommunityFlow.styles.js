import { caribbeanGreen, white, white80onCaribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'

const mixins = {
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: white80onCaribbeanGreen
  }
}
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
    paddingBottom: 10,
    marginTop: -20
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
    marginTop: 100,
    ...mixins.underline
  },
  secondTextInputContainer: {
    marginTop: 10,
    ...mixins.underline
  },
  textInputLabel: {
    color: white80onCaribbeanGreen,
    fontWeight: 'bold'
  },
  textInput: {
    minHeight: 40,
    color: white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center'
  },
  errorRow: {
    alignSelf: 'stretch',
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: white,
    padding: 10,
    marginBottom: 3,
    marginTop: 8,
    borderRadius: 30
  },
  triangle: {
    marginLeft: 30,
    marginTop: -45
  },
  textInputWithButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  reviewTextInput: {
    minHeight: 40,
    color: white,
    fontSize: 18,
    fontWeight: 'bold',
    width: 300
  },
  reviewButton: {
    width: 40,
    height: 30,
    marginBottom: -10
  },
  editContainer: {
    width: 40,
    height: 30
  },
  editText: {
    color: white,
    fontSize: 16,
    marginTop: 10
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
