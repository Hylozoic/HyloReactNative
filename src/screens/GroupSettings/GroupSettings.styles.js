import { capeCod, white, caribbeanGreen, alabaster, rhino30, rhino, capeCod40, rhino80, rhino40, rhino50, rhino20 } from 'style/colors'
import { Dimensions, StyleSheet } from 'react-native'

const screenMargin = 16
const avatarSize = 112
const screenHeight = Dimensions.get('window').height

export default {
  container: {
    backgroundColor: white,
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: white,
    paddingHorizontal: screenMargin
  },
  label: {
    fontSize: 12,
    color: rhino40,
    fontFamily: 'Circular-Bold',
    marginBottom: 5
  },
  input: {
    textAlignVertical: 'top',
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderRadius: 3,
    borderBottomColor: rhino20,
    color: rhino80,
    padding: 10,
    paddingLeft: 0,
    paddingTop: 0,
    marginBottom: 10
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
    color: rhino50,
    marginRight: 2
  },
  editButtonText: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    color: rhino50
  },
  buttonBarContainer: {    
    paddingBottom: 40,
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  saveButton: {
    fontSize: 18,
    height: 40,
    width: 150
  },
  nameInput: {
    color: rhino,
    fontFamily: 'Circular-Bold',
    fontSize: 28,
    backgroundColor: '#FAFBFC',
    borderRadius: 5,
    height: 56,
    paddingTop: 20,
    marginBottom: 20,
    textAlign: 'center'
  }
}
