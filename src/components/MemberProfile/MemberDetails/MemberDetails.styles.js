import {
  nevada, ghost, rhino, rhino50, rhino30, caribbeanGreen
} from 'style/colors'

const screenMargin = 16

export default {
  container: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: screenMargin
  },
  sectionLabel: {
    color: rhino,
    fontSize: 18,
    marginBottom: 10
  },
  bioContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  bio: {
    color: nevada,
    marginBottom: 15
  },
  skillsContainer: {
    marginBottom: 25
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  skill: {
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 12,
    height: 24,
    fontFamily: 'Circular-Book',
    fontSize: 10,
    color: rhino50,
    borderWidth: 1,
    borderColor: ghost,
    lineHeight: 24,
    textAlign: 'center'
  },
  communityRow: {
    flexDirection: 'row',
    marginBottom: 7
  },
  starIcon: {
    marginRight: 5
  },
  communityName: {
    color: caribbeanGreen,
    fontSize: 16,
    fontFamily: 'Circular-Book',
    letterSpacing: 0.22
  },
  memberCount: {
    marginLeft: 'auto',
    color: rhino,
    marginRight: 3
  },
  memberIcon: {
    fontSize: 16,
    color: rhino30
  }
}
