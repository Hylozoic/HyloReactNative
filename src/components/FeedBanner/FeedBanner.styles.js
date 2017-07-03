import { capeCod40, capeCod10 } from '../../style/colors'
import { isIOS } from 'util/platform'

const postPromptShape = {
  position: 'absolute',
  top: 122,
  height: 60,
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent'
  },
  icon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent'
  },
  postPrompt: {
    ...postPromptShape,
    padding: 12,
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
    marginRight: 12
  },
  promptText: {
    color: capeCod40,
    fontSize: 15
  }
}
