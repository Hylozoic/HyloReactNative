import { capeCod40, capeCod10 } from '../../style/colors'
import { isIOS } from 'util/platform'

const postPromptShape = {
  position: 'absolute',
  height: 52,
  borderRadius: 4,
  left: 0,
  right: 0,
  bottom: 0,
  marginLeft: 16,
  marginRight: 16
}

const hasTextShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: 0, height: 2},
  textShadowRadius: 7
}

export default {
  container: {
    zIndex: 10,
    height: 173,
    marginBottom: 24
  },
  image: {
    height: 152,
    width: '100%',
    position: 'absolute'
  },
  gradient: {
    height: 152,
    width: '100%',
    position: 'absolute'
  },
  titleRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 66,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    alignItems: 'flex-end'
  },
  name: {
    fontSize: 24,
    fontFamily: 'Circular-Black',
    color: 'white',
    backgroundColor: 'transparent',
    flex: 1,
    ...hasTextShadow
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
    opacity: 0.8,
    ...hasTextShadow
  },
  subscribeButtonIconActive: {
    opacity: 1
  }
}
