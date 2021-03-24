import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'
import {
  bigStone, rhino, rhino50, persimmon, rhino40, black10onRhino, white, rhino30
} from 'style/colors'

const defaultPadding = {
  paddingHorizontal: 15
}

export default {
  defaultPadding,
  parent: {
    flex: 1,
    backgroundColor: rhino
  },

  // Header
  header: {
    height: 160,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10
  },
  headerBannerGradient: {
    height: 160,
    width: '100%',
    position: 'absolute'
  },
  headerBannerImage: {
    height: 160,
    width: '100%',
    position: 'absolute'
  },
  headerAvatar: {
    marginTop: 40,
    height: 42,
    width: 42,
    borderRadius: 4
  },
  headerText: {
    fontFamily: 'Circular-Bold',
    color: white,
    marginTop: 6,
    fontSize: 20
  },
  headerSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  headerSettingsButtonIcon: {
    fontFamily: 'Circular-Book',
    color: white,
    marginRight: 6,
    fontSize: 16
  },
  headerSettingsButtonText: {
    fontFamily: 'Circular-Book',
    color: white,
    fontSize: 16
  },
  sectionHeader: {
    ...defaultPadding,
  },
  sectionHeaderText: {
    color: rhino50,
    fontFamily: 'Circular-Book',
    fontSize: 12
  },

  // Groups rows
  groupSectionSeparator: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: rhino30,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  rowTouchable: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupRow: {
    marginLeft: 10,
    paddingVertical: 10
  },
  allFeedsIcon: {
    marginLeft: 5,
    marginRight: 11
  },
  groupAvatar: {
    height: 24,
    width: 24,
    marginRight: 8,
    borderRadius: 4
  },
  groupRowText: {
    fontFamily: 'Circular-Book',
    color: rhino40,
    flex: 1,
    fontSize: 16
  },
  highlight: {
    color: 'white',
    fontFamily: 'Circular-Bold'
  },
  isMember: {
    color: 'white'
  },
  badge: {
    backgroundColor: persimmon,
    height: 20,
    width: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 12
  },

  // Footer
  createGroupButton: {
    backgroundColor: black10onRhino,
    paddingTop: 15,
    paddingBottom: 15,
    height: 40,
    fontSize: 14,
    paddingRight: '7%',
    paddingLeft: '7%'
  },
  footer: {
    backgroundColor: bigStone,
    padding: 10,
    paddingBottom: isIOS ? 30 : 10,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  footerContent: {
    flex: 1,
    marginLeft: 10
  },
  footerTopText: {
    color: 'white',
    fontSize: 16
  },
  footerText: {
    color: 'white',
    fontSize: 14
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  footerButton: {
    marginRight: 30
  },

}
