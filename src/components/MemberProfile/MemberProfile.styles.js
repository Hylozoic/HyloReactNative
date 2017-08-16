import {
  capeCod, rhino80, rhino60, rhino50, caribbeanGreen, alabaster
} from '../../style/colors'

const screenMargin = 16

export default {
  marginContainer: {
    marginHorizontal: screenMargin
  },
  bannerImage: {
    height: 140
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 40
  },
  avatarImage: {
    position: 'absolute',
    top: -38,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'white'
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
