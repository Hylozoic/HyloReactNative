import { StyleSheet } from 'react-native'
import {
  gunsmoke, rhino30, rhino80, caribbeanGreen, white60onCaribbeanGreen, amaranth, white
} from 'style/colors'

export default {
  header: {
    backgroundColor: 'white'
  },
  headerTitleStyle: {
    fontSize: 17,
    color: 'black',
    fontFamily: 'Circular-Bold'
  },
  headerTintColor: gunsmoke,
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20
  },
  scrollContainer: {
    flexGrow: 1
  },
  setting: {
    marginBottom: 23
  },
  settingLabel: {
    fontSize: 10,
    color: rhino30,
    fontFamily: 'Circular-Bold',
    marginBottom: 10
  },
  settingText: {
    fontSize: 16,
    color: rhino80,
    fontFamily: 'Circular-Book'
  },
  loadingText: {
    color: white60onCaribbeanGreen,
    fontFamily: 'Circular-Book'
  },
  linkText: {
    color: caribbeanGreen,
    fontFamily: 'Circular-Book'
  },
  cancelPassword: {
    marginBottom: 15
  },
  socialAccountsLabel: {
    marginBottom: 3
  },
  socialControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: rhino30,
    paddingBottom: 8,
    marginBottom: 10
  },
  linked: {
    borderColor: caribbeanGreen
  },
  notificationSettingsWrapper: {
    marginTop: 50,
    alignItems: 'center'
  },
  blockedUsersWrapper: {
    marginTop: 50,
    alignItems: 'center'
  },
  blockedUsers: {
    height: 43,
    width: 205,
    fontSize: 16,
    marginBottom: 5,
    color: caribbeanGreen,
    borderColor: caribbeanGreen,
    backgroundColor: white
  },
  notificationSettings: {
    height: 43,
    width: 205,
    fontSize: 16,
    marginBottom: 5,
    color: caribbeanGreen,
    borderColor: caribbeanGreen,
    backgroundColor: white
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 12
  },
  save: {
    width: 170,
    height: 43,
    fontSize: 16,
    marginBottom: 5,
    disabledBackgroundColor: white60onCaribbeanGreen
  },
  cancel: {
    fontSize: 16,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginBottom: 20
  },
  logoutButton: {
    width: 134,
    height: 30,
    backgroundColor: 'white',
    borderColor: amaranth,
    color: amaranth
  },
  settingControl: {
    control: {
      marginBottom: 3
    },
    label: {
      fontSize: 10,
      color: rhino30,
      fontFamily: 'Circular-Bold',
      marginBottom: 10
    },
    textInput: {
      fontSize: 16,
      color: rhino80,
      fontFamily: 'Circular-Book',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: rhino30
    },
    error: {
      paddingVertical: 0,
      paddingBottom: 10
    },
    hideErrorTriangle: true
  }
}
