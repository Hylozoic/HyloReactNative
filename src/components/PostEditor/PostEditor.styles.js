import { isIOS } from 'util/platform'

import {
  havelockBlue,
  fakeAlpha,
  ghost,
  jade,
  limedSpruce,
  rhino10,
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
    opacity: 0.45
  },
  details: {
    height: 300
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
    fontFamily: 'Circular-Medium'
  },
  saveButton: {
    marginRight: 10
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor: rhino10,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  addImageButtonIcon: {
    color: limedSpruce,
    width: '100%',
    textAlign: 'center'
  },
  addImageButtonImage: {
    width: 100,
    height: 100,
    borderRadius: 4
  },
  hiddenImagePicker: {
    width: 0,
    height: 0
  }
}
