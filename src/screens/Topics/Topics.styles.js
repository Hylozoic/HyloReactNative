import { StyleSheet } from 'react-native'
import { white, caribbeanGreen, capeCod40, capeCod20, rhino50, ghost } from 'style/colors'
import { isIOS } from 'util/platform'

const hasTextShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 7
}

export default {
  container: {
    backgroundColor: white,
    flex: 1
  },
  bannerContainer: {
    zIndex: 10,
    height: 142,
    marginBottom: 10
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
  name: {
    fontSize: 24,
    fontFamily: 'Circular-Black',
    color: white,
    backgroundColor: 'transparent',
    ...hasTextShadow
  },
  // 
  searchBar: {
    marginHorizontal: 8,
    marginBottom: 12
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
