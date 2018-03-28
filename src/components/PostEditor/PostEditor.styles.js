import { isIOS } from 'util/platform'
import {
  caribbeanGreen,
  fakeAlpha,
  ghost,
  havelockBlue,
  jade,
  limedSpruce,
  rhino10,
  rhino30,
  westSide
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
    borderColor: ghost
  },
  textInput: {
    height: isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    paddingBottom: 4
  },
  textInputPlaceholder: {
    height: isIOS ? 22 : null,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    paddingBottom: 4,
    color: rhino30
  },
  details: {
    paddingTop: isIOS ? null : 15
  },
  typeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  typeButton: {
    box: {
      borderRadius: 4,
      backgroundColor: rhino10,
      paddingVertical: 10,
      width: '31%'
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
    }
  },
  section: {
    marginBottom: 20
  },
  sectionLabel: {
    marginBottom: 8,
    fontFamily: 'Circular-Bold'
  },
  saveButton: {
    marginRight: 10
  },
  topics: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
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
    flexDirection: 'row',
    marginBottom: 10
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
  imageSelector: {
    marginBottom: 10
  }
}
