import { rhino10, limedSpruce } from 'style/colors'
import { Dimensions } from 'react-native'
import postEditorStyles from '../PostEditor.styles'

const screenPadding = 0 // postEditorStyles.scrollContainer.paddingHorizontal
const containerWidth = Dimensions.get('window').width - 2 * screenPadding
const buttonMargin = 10
const buttonWidth = (containerWidth - 2 * buttonMargin) / 3

export default {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    borderRadius: 4
  },
  hiddenImagePicker: {
    width: 0,
    height: 0
  }
}
