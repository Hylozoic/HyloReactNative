import {
  capeCod, rhino80, rhino60, rhino50, caribbeanGreen, alabaster
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
  header: {
    marginBottom: 15
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  name: {
    fontSize: 24,
    color: capeCod,
    fontFamily: 'Circular-Bold'
  },
  icons: {
    flexDirection: 'row',
    marginLeft: 'auto'
  },
  icon: {
    fontSize: 30,
    color: rhino60,
    marginRight: 10
  },
  lastIcon: {
    fontSize: 30,
    color: rhino60
  },
  location: {
    fontSize: 14,
    color: rhino50,
    fontFamily: 'Circular-Book',
    marginBottom: 2
  },
  tagline: {
    fontSize: 16,
    color: rhino80,
    fontFamily: 'Circular-Book'
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
