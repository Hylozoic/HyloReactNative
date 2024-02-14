import { caribbeanGreen, white, white80onCaribbeanGreen, rhino80 } from 'style/colors'
import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'

export default {
  container: {
    flex: 1
  },
  header: {
    marginBottom: 20
  },
  content: {},
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40
  },
  heading: {
    color: white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  description: {
    color: white80onCaribbeanGreen,
    marginBottom: 4
  },
  button: {
    width: 134,
    height: 40,
    fontSize: 16,
    backgroundColor: 'white',
    color: caribbeanGreen,
    alignSelf: 'flex-end'
  },
  textInputContainer: {
    marginBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: white80onCaribbeanGreen
  },
  textInputLabel: {
    color: white80onCaribbeanGreen,
    fontWeight: 'bold'
  },
  textInput: {
    color: rhino80,
    fontSize: 18,
    height: 100,
    fontWeight: 'bold',
    marginVertical: isIOS ? 10 : 1,
    padding: 15,
    borderColor: rhino80,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    marginBottom: 15,
    marginLeft: 24
  },
  errorBubble: {
    marginTop: -8
  },
  textInputWithButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editContainer: {
    width: 30,
    height: 30
  },
  editText: {
    color: white,
    fontSize: 16,
    marginTop: 10
  },
  groupAvatar: {
    height: 20,
    width: 20
  },
  avatarContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 24,
    width: 24
  },
  columnStyling: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerBackground: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6
  },
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: caribbeanGreen,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 5
  },
  callToAction: {
    height: 44
  },
  callToActionText: {
    flexGrow: 1,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: 34,
    paddingLeft: 10,
    paddingRight: 10
  },
  purposeText: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  },
  listNumber: {
    fontFamily: 'Circular-Book',
    width: 24,
    fontSize: 18
  },
  agreementListItem: {
    marginTop: 6,
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row'
  },
  agreementText: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  },
  agreementAccepted: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  },
  optionCheckbox: {
    marginTop: 10,
    // color: caribbeanGreen,
    height: 16,
    width: 12,
    marginLeft: 2
  },
  sectionHeading: {
    backgroundColor: 'transparent',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: 24,
    marginTop: 6
  },
  agreementTitle: {
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold'
  },
  acceptanceText: {
    fontFamily: 'Circular-Book',
    fontSize: 16,
    color: 'orange',
    lineHeight: 24
  },
  skillPills: {
    backgroundColor: 'rgba(255, 255, 255, 1.00)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  joinQuestions: {
    backgroundColor: 'rgba(249, 250, 251, 1.000)',
    borderWidth: 1,
    borderColor: 'rgba(224, 229, 233, 1.000)',
    borderRadius: 8,
    padding: 6,
    width: '90%',
    margin: 5
  }
}
