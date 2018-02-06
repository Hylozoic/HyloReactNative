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
  searchBar: {
    position: 'relative',
    top: -16,
    flexDirection: 'row',
    borderColor: capeCod40,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 100,
    marginHorizontal: 15,
    height: 31
  },
  searchIcon: {
    fontSize: 26,
    color: capeCod40,
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 3,
    position: 'relative',
    top: 3
  },
  searchInput: {
    flex: 1
  },
  topicList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: capeCod40,
    paddingLeft: 15
  },
  emptyList: {
    paddingVertical: 10
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
  rightItems: {
    flexDirection: 'row',
    marginLeft: 'auto'
  },
  badge: {
    marginRight: 10,
    position: 'relative',
    top: 3
  },
  chevron: {
    marginRight: 12,
    fontSize: 24,
    color: capeCod20
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
