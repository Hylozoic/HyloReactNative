import { capeCod40, capeCod10, caribbeanGreen, white } from 'style/colors'
import { isIOS } from 'util/platform'

const postPromptShape = {
  position: 'absolute',
  height: 52,
  borderRadius: 2,
  left: 0,
  right: 0,
  bottom: -26,
  marginHorizontal: 12
}

const hasTextShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 7
}

export default {
  bannerContainer: {
    zIndex: 10,
    height: 142,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  bannerContainerWithPostPrompt: {
    marginBottom: 34
  },
  image: {
    height: 142,
    width: '100%',
    position: 'absolute'
  },
  gradient: {
    height: 142,
    width: '100%',
    position: 'absolute'
  },
  titleRow: {
    position: 'absolute',
    left: 0,
    bottom: 56,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  title: {
    flex: 1
  },
  name: {
    fontSize: 24,
    fontFamily: 'Circular-Black',
    color: white,
    textAlign: 'left',
    backgroundColor: 'transparent',
    ...hasTextShadow
  },
  //
  topicInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  subName: {
    flexWrap: 'wrap',
    fontSize: 16,
    fontFamily: 'Circular',
    color: white,
    paddingRight: 10,
    backgroundColor: 'transparent'
  },
  postPrompt: {
    ...postPromptShape,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: white,
    borderWidth: isIOS ? 0 : 1,
    borderColor: capeCod10
  },
  promptShadow: {
    ...postPromptShape,
    backgroundColor: white,
    shadowOffset: { width: 0, height: 4 },
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
    fontSize: 14
  },
  unsubscribeButton: {
    width: 130,
    color: caribbeanGreen,
    backgroundColor: white,
    borderColor: 'transparent',
    marginLeft: 'auto',
    marginRight: 10,
    marginBottom: 20,
    height: 35,
    fontSize: 14
  },
  subscribeButton: {
    width: 130,
    color: white,
    backgroundColor: caribbeanGreen,
    borderColor: 'transparent',
    marginLeft: 'auto',
    marginRight: 10,
    marginBottom: 20,
    height: 35,
    fontSize: 14
  },
  newPostButton: {
    width: 150,
    borderColor: 'transparent',
    marginLeft: 'auto',
    marginRight: 10,
    marginBottom: 20,
    height: 35,
    fontSize: 14
  }
}
