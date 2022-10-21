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
  padding: isIOS ? 10 : 2,
  paddingLeft: 8,
  paddingRight: 30,
  marginHorizontal: 10,
  marginBottom: isIOS ? 10 : 3,
  alignItems: 'center'
  // justifyContent: 'flex-start'
}

const typeSelectAndroidDefaults = {
  ...typeSelectorIOSDefaults
}

export const typeSelectorStyles = postType => ({
  icon: {
    fontSize: 23,
    marginTop: isIOS ? 7 : 5,
    marginLeft: 0,
    marginRight: 15,
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
  scrollContainer: {
    // flex: 1,
    backgroundColor: 'white'
    // paddingHorizontal: 16
  },
  scrollContent: {
    paddingVertical: 12,
    paddingBottom: 50
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
  topicPillBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  topicPill: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: rhino30,
    marginTop: 5,
    marginRight: 5,
    paddingVertical: 4,
    paddingHorizontal: 7,
    paddingRight: 5,
    fontSize: 14
  },
  topicRemove: {
    color: amaranth,
    fontSize: 16,
    marginLeft: 10
  },
  topicText: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Bold',
    fontSize: 16
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
    justifyContent: 'center',
    // backgroundColor: rhino30,
    // marginBottom: 10,
    // paddingBottom: isIOS ? 10 : 0
  },
  pressSelection: {
    // backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  pressSelectionLeft: {
    color: caribbeanGreen,
    // color: white,
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
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 14,
    color: caribbeanGreen,
    fontFamily: 'Circular-Book'
  },
  pressDisabled: {
    color: rhino30
  },
  groupRemoveIcon: {
    color: rhino30,
    fontSize: 20
  },
  imageSelector: {
    marginBottom: 10
  },
  bottomBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10
  },
  bottomBarRight: {
    flexDirection: 'row',
    paddingRight: 20
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
    paddingLeft: 20,
    fontSize: 46
  }
}
