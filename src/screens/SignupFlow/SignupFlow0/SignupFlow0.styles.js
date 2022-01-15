import { white, white40onCaribbeanGreen } from 'style/colors'
import defaultStyles from '../SignupFlow.styles'

const styles = {
  ...defaultStyles,
  subTitle: {
    ...defaultStyles.subTitle,
    fontSize: 16
  },
  codeFieldRoot: {
    marginHorizontal: 40
  },
  codeFieldCell: {
    flex: 1,
    flexGrow: 1,
    padding: 5,
    margin: 5,
    textAlign: 'center',
    color: white,
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: 3,
    borderColor: white40onCaribbeanGreen,
  },
  codeFieldCellSeparator: {
    height: 2,
    width: 10,
    backgroundColor: white,
    alignSelf: 'center'
  },
  codeFieldCellFocused: {
    borderColor: white
  }
}

export default styles