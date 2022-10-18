import { isIOS } from 'util/platform'
import { POST_TYPES } from 'store/models/Post'
import {
  caribbeanGreen,
  rhino30,
  white,
  rhino80,
  rhino60,
  rhino,
  amaranth
} from 'style/colors'

const typeSelectorIOSDefaults = {
  fontSize: 14,
  fontWeight: 'bold',
  borderRadius: 5,
  borderWidth: 0,
  color: white,
  padding: isIOS ? 15 : 5,
  paddingLeft: 15,
  paddingRight: 15
}

const typeSelectAndroidDefaults = {
  ...typeSelectorIOSDefaults,
  padding: 10
}

export const typeSelectorStyles = postType => ({
  icon: {
    fontSize: 24,
    marginTop: 12,
    marginRight: 20,
    color: POST_TYPES[postType].primaryColor
  },
  inputIOS: {
    ...typeSelectorIOSDefaults,
    backgroundColor: POST_TYPES[postType].backgroundColor,
    color: POST_TYPES[postType].primaryColor
  },
  inputAndroid: {
    ...typeSelectAndroidDefaults,
    backgroundColor: POST_TYPES[postType].backgroundColor,
    color: POST_TYPES[postType].primaryColor
  }
})

export default {
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16
  },
  scrollContent: {
    paddingVertical: 12,
    paddingBottom: 200
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
    paddingBottom: isIOS ? 10 : 0
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
  topicAdd: {
    color: caribbeanGreen,
    fontSize: 16
  },
  pressSelection: {
    backgroundColor: white,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row'
  },
  pressSelectionLeft: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Bold'
  },
  pressSelectionRight: {
    height: 25,
    width: 25,
    marginHorizontal: 10,
    borderColor: caribbeanGreen,
    borderRadius: 100,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Same as textInput without top padding
  pressSelectionText: {
    paddingVertical: 0,
    paddingBottom: 5,
    fontSize: 16,
    color: caribbeanGreen,
    fontFamily: 'Circular-Book',
    margin: 0,
    padding: 0
  },
  pressDisabled: {
    color: rhino30
  },
  topicPill: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: rhino30,
    marginVertical: 10,
    marginRight: 5,
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  topicPillBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  topicRemove: {
    color: rhino30,
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
  groupRemoveIcon: {
    color: rhino30,
    fontSize: 16,
    marginLeft: 10
  },
  imageSelector: {
    marginBottom: 10
  },
  bottomBar: {
    flexDirection: 'row',
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderTopColor: capeCod40,
    // backgroundColor: capeCod05,
    // padding: isIOS ? 8 : 4,
    // paddingBottom: isIOS ? 30 : 4,
    // paddingLeft: isIOS ? 20 : 10,
    // marginHorizontal: -16

  },
  bottomBarIcons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  bottomBarIcon: {
    paddingRight: 5,
    fontSize: 46,
    color: caribbeanGreen
  },
  bottomBarIconLoading: {
    color: rhino30
  },
  bottomBarAnnouncement: {
    flex: 1
    // alignSelf: 'flex-start',
  },
  bottomBarAnnouncementIcon: {
    fontSize: 46
  }
}
