import { StyleSheet } from 'react-native'
import { rhino, rhino80, rhino60, rhino30, caribbeanGreen } from 'style/colors'

export default {
  container: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1
  },
  skillEditor: {
    title: {
      marginTop: 37,
      fontSize: 20,
      fontFamily: 'Circular-Bold',
      color: rhino,
      marginBottom: 8
    },
    subTitle: {
      fontSize: 13,
      fontFamily: 'Circular-Book',
      color: rhino80,
      marginBottom: 8
    },
    userSkills: {
      minHeight: 20
    },
    yourSkillsLabel: {
      color: rhino80,
      marginBottom: 10
    },
    skillControl: {
      control: {
        marginTop: 0
      },
      label: {
        color: rhino60,
        fontFamily: 'Circular-Book',
        marginBottom: 5
      },
      textInput: {
        color: rhino80,
        fontSize: 16,
        fontFamily: 'Circular-Book',
        borderBottomColor: rhino30,
        borderBottomWidth: StyleSheet.hairlineWidth
      }
    },
    remainingSkills: {
    },
    skillCloud: {
    },
    skillPill: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: rhino60
    },
    skillText: {
      color: rhino60
    },
    continueButton: {
      borderColor: caribbeanGreen
    }
  }
}
