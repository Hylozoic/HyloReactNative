import { caribbeanGreen, capeCod, capeCod10, capeCod20, capeCod40, rhino80, rhino50 } from '../../style/colors'
import { Dimensions } from 'react-native'
import { isIOS } from 'util/platform'

const screenWidth = Dimensions.get('window').width

const messagePromptShape = {
  height: 52,
  borderRadius: 4,
  left: 0,
  right: 0,
  flex: 1
}

const defaultPadding = {
  paddingHorizontal: 12
}

export default {
  container: {
    backgroundColor: 'white',
    position: 'relative',
    flex: 1
  },
  sectionList: {
    ...defaultPadding,
    borderTopWidth: isIOS ? 0 : 1,
    borderTopColor: capeCod20
  },
  messageInput: {
    marginBottom: 20
  },
  scrollViewWrapper: {
    height: 60
  },
  personInputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: capeCod20,
    minWidth: screenWidth
  },
  personTextInput: {
    minWidth: screenWidth
  },
  person: {
    borderWidth: 1,
    borderColor: capeCod20,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    marginRight: 9,
    paddingLeft: 5,
    paddingRight: 10
  },
  personAvatar: {
    marginRight: 10
  },
  closeIcon: {
    paddingLeft: 15,
    fontSize: 20,
    color: rhino50
  },
  sectionHeader: {
    marginTop: 20
  },
  listLabel: {
    color: rhino80,
    fontSize: 18,
    fontFamily: 'Circular-Book',
    marginBottom: 20
  },
  contactRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 225
  },
  grayed: {
    opacity: 0.2
  },
  contactAvatar: {
    marginRight: 20
  },
  contactName: {
    fontFamily: 'Circular-Bold'
  },
  promptContainer: {
    position: 'absolute',
    bottom: 10,
    left: 6,
    right: 6
  },
  messagePrompt: {
    ...messagePromptShape,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderWidth: isIOS ? 0 : 1,
    borderColor: capeCod10
  },
  promptShadow: {
    ...messagePromptShape,
    position: 'absolute',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 5,
    shadowOpacity: 1.0,
    shadowColor: capeCod20,
    zIndex: -10
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  promptAvatar: {
    marginRight: 10
  },
  promptTextInput: {
    color: capeCod,
    fontSize: 14,
    flex: 1
  },
  sendButton: {
    color: caribbeanGreen
  },
  grayButton: {
    color: capeCod40
  }
}
