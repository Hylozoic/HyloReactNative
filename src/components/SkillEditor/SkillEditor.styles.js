import { caribbeanGreen, white60onCaribbeanGreen } from 'style/colors'

const containerPadding = {
  paddingHorizontal: 16
}

export default {
  subTitle: {
    marginBottom: 20
  },
  containerPadding,
  userSkills: {
    minHeight: 100,
    ...containerPadding,
    paddingVertical: 10,
    alignItems: 'center'
  },
  yourSkillsLabel: {
    marginBottom: 10
  },
  skillControl: {
    ...containerPadding,
    marginTop: 18
  },
  remainingSkills: {
    marginBottom: 30
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
    color: caribbeanGreen,
    backgroundColor: 'white',
    disabledBackgroundColor: white60onCaribbeanGreen,
    height: 38,
    width: 142,
    fontSize: 16,
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: containerPadding.paddingHorizontal,
    marginBottom: 20
  }
}
