import { StyleSheet, Dimensions } from 'react-native'
import { caribbeanGreen, white, capeCod40, amaranth, rhino20 } from 'style/colors'
const screenWidth = Dimensions.get('window').width

export default {
  container: {
    flex: 1,
    backgroundColor: white
  },
  tabbar: {
    backgroundColor: white
  },
  tab: {
    width: screenWidth / 2
  },
  indicator: {
    backgroundColor: caribbeanGreen
  },
  label: {
    color: '#000',
    fontFamily: 'Circular-Book'
  },
  successMessage: {
    color: caribbeanGreen,
    marginLeft: 18
  },
  errorMessage: {
    color: amaranth,
    marginLeft: 18
  },
  buttonRow: {
    height: 100,
    flex: 1,
    flexDirection: 'row',
    marginLeft: 18,
    marginBottom: -45,
    marginTop: -10
  },
  pendingInvitesList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: capeCod40,
    paddingLeft: 18,
    paddingRight: 18
  },
  emptyList: {
    paddingVertical: 10
  },
  nameRow: {
    paddingTop: 18,
    paddingBottom: 18,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionRow: {
    paddingBottom: 18,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: capeCod40
  },
  joinCommunityText: {
    marginTop: 20,
    marginLeft: 18,
    marginBottom: 6
  },
  joinCommunityLink: {
    color: caribbeanGreen,
    marginLeft: 18,
    marginBottom: 24
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
    borderColor: rhino20,
    borderWidth: 2,
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 10
  },
  sendInviteButton: {
    width: 200,
    height: 36,
    marginLeft: 'auto',
    marginRight: 18,
    fontSize: 14
  },
  resendAllButton: {
    marginBottom: 18,
    marginTop: 18,
    fontSize: 14,
    height: 36,
    backgroundColor: white,
    borderColor: caribbeanGreen,
    color: caribbeanGreen
  },
  pendingInviteEmail: {

  },
  expireText: {
    fontSize: 14,
    color: 'red'
  },
  resendText: {
    fontSize: 14,
    color: caribbeanGreen,
    marginLeft: 20
  },
  actionItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  timeAgoText: {
    color: rhino20
  },
  androidInvisibleUnderline: 'rgba(0,0,0,0)'
}
