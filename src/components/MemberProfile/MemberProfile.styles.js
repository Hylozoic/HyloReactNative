import {
  capeCod, caribbeanGreen, alabaster
} from '../../style/colors'

const screenMargin = 16

export default {
  marginContainer: {
    marginHorizontal: screenMargin
  },
  bannerWrapper: {
    position: 'relative'
  },
  bannerImage: {
    height: 140,
    width: '100%'
  },
  bannerEditButton: {
    position: 'absolute',
    bottom: -2,
    right: -10,
    paddingRight: 15
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 65
  },
  avatarImage: {
    position: 'absolute',
    top: -56,
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: 'white'
  },
  avatarEditButton: {
    position: 'absolute',
    top: 26
  },
  editButton: {
    backgroundColor: 'white',
    opacity: 0.9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    position: 'relative'
  },
  editIcon: {
    top: 2,
    fontSize: 12,
    color: capeCod,
    marginRight: 2
  },
  editButtonText: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    color: capeCod
  },
  buttonContainer: {
    marginBottom: 30,
    alignItems: 'center'
  },
  buttonWrapper: {
    flexDirection: 'row'
  },
  button: {
    height: 30,
    backgroundColor: alabaster,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 15
  },
  buttonText: {
    color: caribbeanGreen,
    fontSize: 13,
    fontFamily: 'Circular-Bold'
  }
}
