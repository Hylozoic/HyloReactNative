import { StyleSheet } from 'react-native'
import { caribbeanGreen, capeCod40, capeCod20 } from 'style/colors'
const imageHeight = 96

export default {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1
  },
  image: {
    height: imageHeight,
    width: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    height: imageHeight,
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.3
  },
  title: {
    position: 'relative',
    top: -44,
    fontFamily: 'Circular-Bold',
    fontSize: 24,
    color: 'white',
    backgroundColor: 'transparent',
    zIndex: 10,
    marginLeft: 16
  },
  searchPlaceholder: {
    height: 16
  },
  topicList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: capeCod40,
    paddingLeft: 15
  },
  topicRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center'
  },
  firstRow: {
    borderTopWidth: 0
  },
  topicName: {
    fontSize: 16
  },
  star: {
    marginRight: 15
  },
  // themes
  unSubscribedStar: {
    icon: {
      fontSize: 30,
      color: capeCod20,
      backgroundColor: 'white'
    }
  },
  subscribedStar: {
    icon: {
      fontSize: 30,
      color: caribbeanGreen,
      backgroundColor: 'transparent'
    }
  }
}
