import { white40onCaribbeanGreen } from 'style/colors'
import styles from '../SignupFlow.styles'
import controlStyles from 'components/SettingControl/SettingControl.styles'

export default {
  ...styles,
  footer: {
    ...styles.footer,
    marginTop: 20
  },
  subTitle: {
    ...styles.subTitle,
    marginBottom: 20
  },
  imageWrapper: {
    marginBottom: 20,
    alignItems: 'center'
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginHorizontal: 'auto'
  }
}
