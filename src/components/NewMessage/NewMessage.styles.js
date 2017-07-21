import { capeCod40, capeCod10, rhino80 } from '../../style/colors'
import { isIOS } from 'util/platform'

const messagePromptShape = {
  position: 'absolute',
  top: 122,
  height: 52,
  borderRadius: 4,
  left: 0,
  right: 0,
  marginLeft: 16,
  marginRight: 16
}

const defaultPadding = {
  paddingHorizontal: 10
}

export default {
  container: {
    backgroundColor: 'white'
  },
  messageRecipients: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: capeCod10
  },
  contactList: {
    ...defaultPadding,
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
    alignItems: 'center'
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
  postPrompt: {
    ...messagePromptShape,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderWidth: isIOS ? 0 : 1,
    borderColor: capeCod10
  },
  promptShadow: {
    ...messagePromptShape,
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 5,
    shadowOpacity: 1.0,
    shadowColor: capeCod10,
    zIndex: -10
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 10
  },
  promptText: {
    color: capeCod40,
    fontSize: 14,
    fontStyle: 'italic'
  }
}
