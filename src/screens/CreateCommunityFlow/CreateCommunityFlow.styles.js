import { caribbeanGreen, white, white80onCaribbeanGreen } from 'style/colors'
import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'

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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  header: {
    marginBottom: '20%'
  },
  content: {},
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40
  },
  heading: {
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
    alignSelf: 'flex-end'
  },
  textInputContainer: {
    marginBottom: 20,
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
    justifyContent: 'space-between'
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
