import styles from '../SignupFlow.styles'
import { black10OnCaribbeanGreen } from 'style/colors'

const containerPadding = {
  paddingHorizontal: 16
}

export default {
  ...styles,
  container: {
    ...styles.container,
    paddingHorizontal: 0
  },
  containerPadding,
  userSkills: {
    backgroundColor: black10OnCaribbeanGreen,
    minHeight: 100,
    ...containerPadding,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  yourSkillsLabel: {
    ...styles.subTitle,
    marginBottom: 10
  },
  skillCloud: {
    ...containerPadding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10
  },
  skillPill: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 22,
    marginRight: 8,
    marginBottom: 8
  },
  skillText: {
    color: 'white',
    fontFamily: 'Circular-Bold',
    fontSize: 11
  },
  continueButton: {
    ...styles.continueButton,
    marginTop: 'auto',
    marginRight: containerPadding.paddingHorizontal,
    marginBottom: 20
  }
}
