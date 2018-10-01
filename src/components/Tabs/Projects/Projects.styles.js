import { StyleSheet } from 'react-native'
import { caribbeanGreen, capeCod40, capeCod20, rhino50, ghost } from 'style/colors'
import { isIOS } from 'util/platform'

const imageHeight = 132

const hasTextShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: 0, height: 2},
  textShadowRadius: 7
}

export default {
  container: {
    zIndex: 10,
    backgroundColor: 'white',
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1
  },
  bannerContainer: {
    height: imageHeight
  },
  image: {
    height: imageHeight,
    width: '100%',
    position: 'absolute'
  },
  gradient: {
    height: imageHeight,
    width: '100%',
    position: 'absolute'
  },
  title: {
    fontFamily: 'Circular-Black',
    fontSize: 24,
    color: 'white',
    backgroundColor: 'transparent',
    zIndex: 10,
    marginLeft: 16,
    top: 46,
    ...hasTextShadow
  },
  searchBar: {
    flexDirection: 'row',
    borderColor: ghost,
    borderWidth: 1,
    borderRadius: 32,
    marginHorizontal: 8,
    marginTop: 10,
    marginBottom: 10,
    height: 38
  },
  searchIcon: {
    fontSize: 30,
    color: rhino50,
    backgroundColor: 'transparent',
    marginLeft: 5,
    top: 4
  },
  searchInput: {
    flex: 1,
    position: 'relative',
    top: isIOS ? 0 : 1,
    fontFamily: 'Circular-Book'
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
  },
  button: {
    width: 185,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40,
    fontSize: 14
  }
}
