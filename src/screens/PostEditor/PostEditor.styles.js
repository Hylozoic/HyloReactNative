import { isIOS } from 'util/platform'
import { POST_TYPES } from 'store/models/Post'
import {
  caribbeanGreen,
  rhino30,
  white,
  rhino80,
  rhino60
} from 'style/colors'

const typeSelectorDefaults = {
  fontSize: 14,
  fontWeight: 'bold',
  borderRadius: 5,
  borderWidth: 0,
  color: white,
  padding: isIOS ? 20 : 10,
  paddingLeft: 20,
  paddingRight: 20
}

export default {
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 18
  },
  scrollContent: {
    paddingVertical: 12,
    paddingBottom: 200
  },
  textInputWrapper: {
    borderBottomWidth: 0.5,
    borderColor: rhino30
  },
  textInput: {
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Circular-Book',
    margin: 0,
    padding: 0
  },
  textInputPlaceholder: {
    height: isIOS ? 22 : null,
    fontSize: 16,
    fontFamily: 'Circular-Book',
    color: rhino30
  },
  section: {
    marginBottom: 12,
    paddingBottom: 12
  },
  sectionLabel: {
    color: rhino80,
    fontFamily: 'Circular-Bold'
  },

  // Type Selector
  typeSelector: {
    row: {
      marginTop: 0
    },
    icon: {
      fontSize: 24,
      marginTop: isIOS ? 16 : 12,
      marginRight: 20,
      color: rhino60
    },
    discussion: {
      inputIOS: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['discussion'].backgroundColor,
        color: POST_TYPES['discussion'].primaryColor
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['discussion'].backgroundColor,
        color: POST_TYPES['discussion'].primaryColor
      },
    },
    event: {
      inputIOS: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['event'].backgroundColor,
        color: POST_TYPES['event'].primaryColor
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['event'].backgroundColor,
        color: POST_TYPES['event'].primaryColor
      }
    },
    offer: {
      inputIOS: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['offer'].backgroundColor,
        color: POST_TYPES['offer'].primaryColor
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['offer'].backgroundColor,
        color: POST_TYPES['offer'].primaryColor
      }
    },
    resource: {
      inputIOS: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['resource'].backgroundColor,
        color: POST_TYPES['resource'].primaryColor
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['resource'].backgroundColor,
        color: POST_TYPES['resource'].primaryColor
      }
    },
    project: {
      inputIOS: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['project'].backgroundColor,
        color: POST_TYPES['project'].primaryColor
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['project'].backgroundColor,
        color: POST_TYPES['project'].primaryColor
      }
    },
    request: {
      inputIOS: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['request'].backgroundColor,
        color: POST_TYPES['request'].primaryColor
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        backgroundColor: POST_TYPES['request'].backgroundColor,
        color: POST_TYPES['request'].primaryColor
      }
    }
  },
  detailsEditor: {
    minHeight: 50
  },
  topics: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  topicAdd: {
    color: caribbeanGreen,
    fontSize: 16
  },
  pressSelection: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row'
  },
  pressSelectionLeft: {
    color: rhino80,
    fontFamily: 'Circular-Bold'
  },
  pressSelectionRight: {
    height: 25,
    width: 25,
    marginHorizontal: 10,
    borderColor: caribbeanGreen,
    borderRadius: 100,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Same as textInput without top padding
  pressSelectionText: {
    paddingVertical: 0,
    paddingBottom: 5,
    fontSize: 16,
    color: caribbeanGreen,
    fontFamily: 'Circular-Book',
    margin: 0,
    padding: 0
  },
  pressDisabled: {
    color: rhino30
  },
  topicPill: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: rhino30,
    marginVertical: 10,
    marginRight: 5,
    paddingVertical: 5,
    paddingHorizontal: 8
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
  groupRemoveIcon: {
    color: rhino30,
    fontSize: 16,
    marginLeft: 10
  },
  imageSelector: {
    marginBottom: 10
  },
  bottomBar: {
    flexDirection: 'row',
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderTopColor: capeCod40,
    // backgroundColor: capeCod05,
    // padding: isIOS ? 8 : 4,
    // paddingBottom: isIOS ? 30 : 4,
    // paddingLeft: isIOS ? 20 : 10,
    // marginHorizontal: -16

  },
  bottomBarIcons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  },
  bottomBarIcon: {
    paddingRight: 5,
    fontSize: 46,
    color: caribbeanGreen
  },
  bottomBarIconLoading: {
    color: rhino30
  },
  annoucementIcon: {
    fontSize: 46
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
