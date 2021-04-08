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
  white,
  prim,
  fuchsiaPink,
  slateGrey80
} from 'style/colors'

const typeSelectorDefaults = {
  // backgroundColor: fakeAlpha(havelockBlue, 0.2),
  fontSize: 12,
  fontWeight: 'bold',
  borderRadius: 5,
  borderColor: havelockBlue,
  borderWidth: StyleSheet.hairlineWidth,
  color: havelockBlue,
  padding: 10,
  paddingRight: 50
}

export default {
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16
  },
  scrollContainer: {
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
    fontSize: 14,
    fontFamily: 'Circular-Book',
    margin: 0,
    padding: 0
  },
  textInputPlaceholder: {
    height: isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    color: rhino30
  },
  detailsEditorInput: {
    fontFamily: 'Circular-Book',
    padding: 0,
    margin: 0
  },
  detailsEditorContainer: {},
  section: {
    marginBottom: 8,
    paddingBottom: 8
  },
  sectionLabel: {
    fontFamily: 'Circular-Bold'
  },

  // Type Selector
  typeSelector: {
    row: {
      marginTop: 10
    },
    icon: {
      fontSize: 20,
      marginTop: 8,
      marginRight: 10,
      color: havelockBlue  
    },
    discussion: {
      inputIOS: {
        ...typeSelectorDefaults,
        // backgroundColor: fakeAlpha(havelockBlue, 0.2),
        borderColor: havelockBlue,
        color: havelockBlue,        
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        borderColor: havelockBlue,
        color: havelockBlue,        
      },
    },
    event: {
      inputIOS: {
        ...typeSelectorDefaults,
        // backgroundColor: 'rgba(254, 72, 80, .2)'
        borderColor: 'rgba(254, 72, 80, 1)',
        color: 'rgba(254, 72, 80, 1)',        
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        borderColor: 'rgba(254, 72, 80, 1)',
        color: 'rgba(254, 72, 80, 1)'
      }
    },
    offer: {
      inputIOS: {
        ...typeSelectorDefaults,
        // backgroundColor: fakeAlpha(jade, 0.2)
        borderColor: jade,
        color: jade,        
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        borderColor: jade,
        color: jade,        
      }
    },
    resource: {
      inputIOS: {
        ...typeSelectorDefaults,
        // backgroundColor: fakeAlpha(mangoYellow, 0.2)
        borderColor: mangoYellow,
        color: mangoYellow,        
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        borderColor: mangoYellow,
        color: mangoYellow,        
      }
    },
    project: {
      inputIOS: {
        ...typeSelectorDefaults,
        // backgroundColor: fakeAlpha(westSide, 0.2)
        borderColor: westSide,
        color: westSide,        
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        borderColor: westSide,
        color: westSide,        
      }
    },
    request: {
      inputIOS: {
        ...typeSelectorDefaults,
        // backgroundColor: prim
        borderColor: fuchsiaPink,
        color: fuchsiaPink,        
      },
      inputAndroid: {
        ...typeSelectorDefaults,
        borderColor: fuchsiaPink,
        color: fuchsiaPink,        
      }
    }
  },
  
  topics: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  topicAddBorder: {
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    backgroundColor: white,
    padding: 8,
    marginHorizontal: -16
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
