import { Dimensions } from 'react-native'
import { caribbeanGreen, white, amaranth, rhino20, white60onCaribbeanGreen, black, rhino80 } from 'style/colors'
const screenWidth = Dimensions.get('window').width

export default {
  container: {
    backgroundColor: white,
    display: 'flex',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 18
  },
  indicator: {
    backgroundColor: caribbeanGreen
  },
  successMessage: {
    color: caribbeanGreen
  },
  errorMessage: {
    color: amaranth
  },
  joinGroupText: {
    marginBottom: 15,
    color: rhino80
  },
  joinGroupLink: {
    color: caribbeanGreen
  },
  linkButtonRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 35
  },
  copyLinkButton: {
    height: 36,
    backgroundColor: white,
    width: 110,
    borderColor: caribbeanGreen,
    color: caribbeanGreen,
    fontSize: 14,
    marginRight: 14
  },
  resetLinkButton: {
    height: 36,
    backgroundColor: white,
    width: 110,
    borderColor: rhino20,
    color: rhino20,
    fontSize: 14,
    marginRight: 14
  },
  textInput: {
    padding: 10,
    borderColor: rhino20,
    borderWidth: 1,
    maxHeight: 200,
    marginBottom: 15
  },
  emailButtonsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  sendInviteButton: {
    width: 180,
    height: 36,
    fontSize: 14,
    disabledBackgroundColor: white60onCaribbeanGreen,
    disabledColor: white
  },
  pendingInviteButton: {
    width: 130,
    height: 36,
    fontSize: 14,
    backgroundColor: white,
    borderColor: caribbeanGreen,
    color: caribbeanGreen
  }
}
