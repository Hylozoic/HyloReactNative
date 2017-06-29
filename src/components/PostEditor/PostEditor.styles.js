import {
  havelockBlue,
  fakeAlpha,
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
  header: {
    height: 40
  },
  titleWrapper: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'blue'
  },
  title: {
    height: 30
  },
  typeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16
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
      textAlign: 'center'
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
  }
}
