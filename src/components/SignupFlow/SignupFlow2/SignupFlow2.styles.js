import { white40onCaribbeanGreen } from 'style/colors'
import styles from '../SignupFlow.styles'

const imagePickerChild = {
  width: 138,
  height: 138,
  borderRadius: 70,
  marginBottom: 15
}

export default {
  ...styles,
  image: {
    ...imagePickerChild
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  continueButton: {
    ...styles.continueButton,
    marginBottom: 20
  },
  imagePickerBackground: {
    ...imagePickerChild,
    backgroundColor: white40onCaribbeanGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraIcon: {
    fontSize: 60,
    color: 'white'
  }
}
