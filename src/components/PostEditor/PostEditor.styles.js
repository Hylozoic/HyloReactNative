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
      padding: 10,
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
  }
}
