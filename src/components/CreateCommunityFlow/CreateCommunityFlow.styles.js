import { caribbeanGreen, white, white80onCaribbeanGreen } from 'style/colors'
import { StyleSheet, Dimensions } from 'react-native'
import { isIOS } from 'util/platform'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width
const containerHeightModifier = isIOS ? 60 : 80

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
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    minHeight: screenHeight - containerHeightModifier
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
    alignSelf: 'stretch',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: isIOS ? 20 : 0
  },
  textInputContainer: {
    marginTop: 100,
    ...mixins.underline
  },
  urlTextInputContainer: {
    marginTop: 59,
    ...mixins.underline
  },
  reviewTextInputContainer: {
    marginTop: isIOS ? 100 : 20,
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
  errorBubble: {
    marginTop: 8
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
  editContainer: {
    width: 30,
    height: 30
  },
  editText: {
    color: white,
    fontSize: 16,
    marginTop: 10
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
