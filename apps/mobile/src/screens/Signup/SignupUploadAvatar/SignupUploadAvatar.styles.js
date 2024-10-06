import { black10onRhino, white40onCaribbeanGreen } from 'style/colors'
import styles from '../SignupFlow.styles'

const imagePickerChild = {
  width: 138,
  height: 138,
  borderRadius: 70,
  marginBottom: 15
}

export default {
  ...styles,
  header: {
    ...styles.header,
    alignItems: 'center'
  },
  content: {
    ...styles.content,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    ...imagePickerChild
  },
  imagePickerBackground: {
    ...imagePickerChild,
    backgroundColor: white40onCaribbeanGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageLoading: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraIcon: {
    fontSize: 60,
    color: 'white'
  }
}
