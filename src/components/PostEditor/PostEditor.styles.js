import { isIOS } from 'util/platform'
import { StyleSheet } from 'react-native'
import {
  caribbeanGreen,
  fakeAlpha,
  havelockBlue,
  jade,
  limedSpruce,
  mangoYellow,
  rhino10,
  rhino30,
  westSide,
  capeCod40,
  white
} from 'style/colors'

export default {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollContainer: {
    paddingHorizontal: 16,
    flex: 1
  },
  scrollContent: {
    paddingVertical: 12
  },
  textInputWrapper: {
    borderBottomWidth: 0.5,
    borderColor: rhino30
  },
  textInput: {
    height: isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    paddingBottom: 4,
    marginBottom: 4
  },
  textInputPlaceholder: {
    height: isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    paddingBottom: 4,
    color: rhino30
  },
  detailsEditorInput: {
    fontFamily: 'Circular-Book'
  },
  detailsEditorContainer: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: rhino30,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  details: {
    paddingTop: isIOS ? null : 15
  },
  typeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  typeButton: {
    box: {
      borderRadius: 4,
      backgroundColor: rhino10,
      paddingVertical: 10,
      width: '23%'
    },
    text: {
      color: limedSpruce,
      letterSpacing: 0.8,
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'Circular-Bold'
    },
    discussion: {
      box: {
        backgroundColor: fakeAlpha(havelockBlue, 0.2)
      },
      text: {
        color: havelockBlue
      }
    },
    request: {
      box: {
        backgroundColor: fakeAlpha(westSide, 0.2)
      },
      text: {
        color: westSide
      }
    },
    offer: {
      box: {
        backgroundColor: fakeAlpha(jade, 0.2)
      },
      text: {
        color: jade
      }
    },
    resource: {
      box: {
        backgroundColor: fakeAlpha(mangoYellow, 0.2)
      },
      text: {
        color: mangoYellow
      }
    }
  },
  section: {
    marginBottom: 8
  },
  sectionLabel: {
    marginBottom: 8,
    fontFamily: 'Circular-Bold'
  },
  topics: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 5
  },
  topicAddBorder: {
    borderColor: caribbeanGreen,
    borderRadius: 100,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    height: 25,
    justifyContent: 'center',
    padding: 3,
    marginBottom: 8,
    marginHorizontal: 10,
    width: 25
  },
  topicAdd: {
    color: caribbeanGreen,
    fontSize: 16
  },
  topicLabel: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  topicPill: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: rhino30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8
  },
  topicPillBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  topicRemove: {
    color: rhino30,
    fontSize: 16,
    marginLeft: 10
  },
  topicText: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Bold',
    fontSize: 16
  },
  members: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 0
  },
  communityRemoveIcon: {
    color: rhino30,
    fontSize: 16,
    marginLeft: 10
  },
  imageSelector: {
    marginBottom: 10
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    backgroundColor: white,
    padding: 8
  },
  bottomBarIcons: {
    flexDirection: 'row',
    flex: 1
  },
  bottomBarIcon: {
    fontSize: 46,
    color: rhino30
  },
  annoucementIcon: {
    fontSize: 46
  },
  search: {
    marginTop: isIOS ? 20 : null
  },
  errorView: {
    marginTop: -18,
    marginBottom: -23,
    zIndex: 999
  },
  errorBubble: {
    color: 'white',
    backgroundColor: 'red'
  },
  errorRow: {
    backgroundColor: 'red'
  }
}
