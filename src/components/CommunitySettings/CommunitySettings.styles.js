import { capeCod, white, caribbeanGreen, alabaster, rhino30, rhino } from '../../style/colors'

const screenMargin = 16
const avatarSize = 112

export default {
  container: {
    backgroundColor: white
  },
  contentContainer: {
    backgroundColor: white,
    paddingTop: 20,
    paddingHorizontal: screenMargin
  },
  label: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Bold'
  },
  input: {
    textAlignVertical: 'top',
    paddingLeft: 0
  },
  bannerImage: {
    height: 140,
    width: '100%',
    borderRadius: 5
  },
  bannerEditButton: {
    position: 'absolute',
    bottom: -2,
    right: -10,
    paddingRight: 15
  },
  bannerImagePicker: {
    height: 140
  },
  avatarW3: {
    alignItems: 'center'
  },
  avatarWrapperWrapper: {
    top: -56,
    marginBottom: -40,
    width: avatarSize
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative'
  },
  avatarImage: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: 5
  },
  avatarEditButton: {
    position: 'absolute',
    top: 83
  },
  editButton: {
    backgroundColor: white,
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
  },
  nameInput: {
    color: rhino,
    fontFamily: 'Circular-Bold',
    fontSize: 28,
    backgroundColor: '#FAFBFC',
    borderRadius: 5,
    height: 56,
    marginBottom: 15,
    textAlign: 'center'
  }
}
