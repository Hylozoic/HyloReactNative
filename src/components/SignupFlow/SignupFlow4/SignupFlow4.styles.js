import { black10OnCaribbeanGreen } from 'style/colors'
import styles from '../SignupFlow.styles'

const containerPadding = {
  paddingHorizontal: 16
}

export default {
  ...styles,
  container: {
    ...styles.container,
    paddingHorizontal: 0
  },
  skillEditor: {
    title: {
      ...containerPadding,
      ...styles.title
    },
    subTitle: {
      ...containerPadding,
      ...styles.subTitle,
      marginBottom: 20
    },
    containerPadding,
    userSkills: {
      backgroundColor: black10OnCaribbeanGreen,
      ...containerPadding
    },
    yourSkillsLabel: {
      ...styles.subTitle,
      marginBottom: 10
    },
    skillControl: {
      control: {
        ...containerPadding,
        marginTop: 18
      }
    },
    skillCloud: {
      ...containerPadding,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 10
    },
    continueButton: {
      ...styles.continueButton,
      marginRight: 16
    }
  }
}
