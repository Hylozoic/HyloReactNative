import { isIOS } from 'util/platform'
import { POST_TYPES } from 'store/models/Post'
import {
  caribbeanGreen,
  rhino30,
  white,
  rhino80,
  rhino,
  amaranth
} from 'style/colors'

const typeSelectorIOSDefaults = {
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 0.2,
  borderRadius: 5,
  borderWidth: 1,
  color: white,
  padding: isIOS ? 6 : 2,
  paddingLeft: 8,
  paddingRight: 30,
  marginHorizontal: 0,
  marginBottom: isIOS ? 0 : 0,
  alignItems: 'center'
  // justifyContent: 'flex-start'
}

const typeSelectAndroidDefaults = {
  ...typeSelectorIOSDefaults
}

export const typeSelectorStyles = postType => ({
  icon: {
    fontSize: 23,
    marginTop: isIOS ? 6 : 5,
    marginLeft: 0,
    marginRight: 5,
    color: POST_TYPES[postType].primaryColor
  },
  inputIOS: {
    ...typeSelectorIOSDefaults,
    backgroundColor: white,
    borderColor: POST_TYPES[postType].primaryColor,
    color: POST_TYPES[postType].primaryColor
  },
  inputAndroid: {
    ...typeSelectAndroidDefaults,
    backgroundColor: white,
    borderColor: POST_TYPES[postType].primaryColor,
    color: POST_TYPES[postType].primaryColor
  }
})

export default {
  headerContainer: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: rhino30
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerCloseIcon: {
    padding: 0,
    fontSize: 34
  },
  headerSaveButton: {
    width: '25%',
    height: 39,
    fontSize: 18,
    disabledColor: rhino30,
    disabledBackgroundColor: white
  },
  typeSelectorWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  formWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formContent: {
    paddingVertical: 12
  },
  textInputWrapper: {
    // paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: rhino30
  },
  textInput: {
    fontSize: 16,
    textAlignVertical: 'top',
    color: 'rgba(44, 64, 89, 0.7)',
    fontFamily: 'Circular-Book',
    margin: 0,
    padding: 0
  },
  titleInputWrapper: {
    paddingBottom: isIOS ? 10 : 0,
    paddingHorizontal: 10
  },
  titleInput: {
    color: rhino,
    fontSize: 19,
    fontFamily: 'Circular-Medium',
    padding: 0
  },
  titleInputError: {
    fontSize: 14,
    color: amaranth
  },
  detailsInputWrapper: {
    paddingBottom: isIOS ? 10 : 0,
    paddingHorizontal: 10
  },
  textInputPlaceholder: {
    fontSize: 16,
    fontFamily: 'Circular-Book',
    color: rhino30
  },
  section: {
    marginBottom: 10,
    paddingBottom: 10
  },
  sectionLabel: {
    color: rhino80,
    fontFamily: 'Circular-Bold'
  },
  topics: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  members: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 0
  },
  pressSelectionSection: {
    borderBottomWidth: 0.5,
    borderColor: rhino30,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center'
  },
  pressSelection: {
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  pressSelectionLeft: {
    color: rhino80,
    fontFamily: 'Circular-Bold'
  },
  pressSelectionRight: {
    height: 25,
    width: 25,
    borderColor: caribbeanGreen,
    borderRadius: 100,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressSelectionRightIcon: {
    color: caribbeanGreen,
    fontSize: 16
  },
  pressSelectionValue: {
    margin: 0,
    // padding: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 14,
    color: caribbeanGreen,
    fontFamily: 'Circular-Book'
  },
  pressDisabled: {
    color: rhino30,
    borderColor: rhino30
  },
  groupRemoveIcon: {
    color: rhino30,
    fontSize: 20
  },
  imageSelector: {
    marginBottom: 10,
    flex: 1
  },
  bottomBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 10
  },
  bottomBarRight: {
    flexDirection: 'row'
  },
  bottomBarIcon: {
    fontSize: 46,
    color: caribbeanGreen
  },
  bottomBarIconLoading: {
    color: rhino30
  },
  bottomBarAnnouncement: {
    flex: 1
  },
  bottomBarAnnouncementIcon: {
    paddingLeft: 0,
    fontSize: 46
  }
}
