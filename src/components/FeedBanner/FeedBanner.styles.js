import { capeCod40, capeCod10, rhino } from '../../style/colors'
import { isIOS } from 'util/platform'

const postPromptShape = {
  position: 'absolute',
  top: 122,
  height: 52,
  borderRadius: 4,
  left: 0,
  right: 0,
  marginLeft: 16,
  marginRight: 16
}

export default {
  container: {
    zIndex: 10
  },
  image: {
    height: 152,
    marginBottom: 54
  },
  titleRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    top: 75
  },
  allLogo: {
    width: 40,
    height: 40,
    marginRight: 20,
    position: 'relative',
    top: -5
  },
  allName: {
    color: rhino
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'flex-end'
  },
  postPrompt: {
    ...postPromptShape,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderWidth: isIOS ? 0 : 1,
    borderColor: capeCod10
  },
  promptShadow: {
    ...postPromptShape,
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
  },
  subscribeButton: {

  },
  subscribeButtonIcon: {
    fontSize: 30,
    backgroundColor: 'transparent',
    color: 'white',
    opacity: 0.8
  },
  subscribeButtonIconActive: {
    opacity: 1
  }
}
