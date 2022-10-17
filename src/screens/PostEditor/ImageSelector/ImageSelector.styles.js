import { rhino10, limedSpruce } from 'style/colors'
import { Dimensions } from 'react-native'

const containerWidth = Dimensions.get('window').width - 2
const buttonMargin = 10
const buttonWidth = (containerWidth - 10 * buttonMargin) / 3

export default {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginRight: -buttonMargin
  },
  addImageButton: {
    width: buttonWidth,
    height: buttonWidth,
    borderRadius: 4,
    backgroundColor: rhino10,
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: buttonMargin,
    marginBottom: buttonMargin
  },
  addImageButtonIcon: {
    color: limedSpruce,
    width: '100%',
    textAlign: 'center'
  },
  addImageButtonImage: {
    width: buttonWidth,
    height: buttonWidth,
    resizeMode: 'contain',
    borderRadius: 4
  },
  hiddenImagePicker: {
    width: 0,
    height: 0
  }
}
