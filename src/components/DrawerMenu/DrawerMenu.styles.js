import mixins from '../../style/mixins'
import {
  bigStone, mirage, rhino, rhino50, persimmon, rhino40, black10onRhino, white
} from '../../style/colors'

const defaultPadding = {
  paddingHorizontal: 15
}

export default {
  defaultPadding,
  parent: {
    ...mixins.belowStatusBar,
    flex: 1,
    backgroundColor: rhino
  },
  header: {
    height: 40,
    marginTop: 10
  },
  search: {
    backgroundColor: mirage,
    height: 36,
    borderRadius: 36,
    marginLeft: 15,
    marginRight: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    marginBottom: 0,
    flex: 1,
    flexDirection: 'row'
  },
  searchIcon: {
    color: 'white',
    opacity: 0.5,
    backgroundColor: 'transparent',
    fontSize: 24,
    marginTop: 8,
    marginLeft: 12
  },
  searchText: {
    marginTop: 10,
    marginLeft: 6,
    marginRight: 15,
    color: 'white',
    opacity: 0.5,
    fontSize: 15
  },
  footer: {
    backgroundColor: bigStone,
    padding: 10,
    height: 64,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  footerContent: {
    flex: 1,
    marginLeft: 10
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
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
  sectionHeader: {
    ...defaultPadding,
    marginTop: 10,
    marginBottom: 10
  },
  sectionHeaderText: {
    color: rhino50,
    fontFamily: 'Circular-Book',
    fontSize: 12
  },
  networkRow: {
    ...defaultPadding
  },
  networkRowCollapsed: {
    paddingTop: 10
  },
  networkRowExpanded: {
    backgroundColor: black10onRhino,
    paddingTop: 10,
    paddingBottom: 5
  },
  rowTouchable: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  networkRowTouchable: {
    marginBottom: 5
  },
  networkAvatar: {
    height: 32,
    width: 32,
    marginRight: 8,
    borderRadius: 4
  },
  networkRowText: {
    fontFamily: 'Circular-Bold',
    color: 'white',
    flex: 1,
    fontSize: 15
  },
  networkOpenWrapper: {
    borderLeftWidth: 1,
    borderColor: rhino40,
    paddingLeft: 14
  },
  networkOpenIcon: {
    color: 'white',
    fontSize: 25
  },
  seeAll: {
    color: rhino40,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 3
  },
  communityRow: {
    marginLeft: 10,
    paddingVertical: 10
  },
  allFeedsIcon: {
    marginLeft: 5,
    marginRight: 11
  },
  communityAvatar: {
    height: 21,
    width: 21,
    marginRight: 8,
    borderRadius: 4
  },
  communityRowText: {
    fontFamily: 'Circular-Book',
    color: rhino40,
    flex: 1,
    fontSize: 15
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
  createCommunityButton: {
    backgroundColor: black10onRhino,
    paddingTop: 15,
    paddingBottom: 15,
    height: 40,
    fontSize: 14,
    paddingRight: '7%',
    paddingLeft: '7%'
  },
  communityHeader: {
    width: '94%',
    marginLeft: '3%',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: white,
    paddingBottom: 18,
    marginBottom: 10
  },
  communityHeaderAvatar: {
    marginTop: 18,
    height: 42,
    width: 42,
    borderRadius: 4
  },
  communityHeaderText: {
    fontFamily: 'Circular-Bold',
    color: white,
    marginTop: 10,
    fontSize: 24
  },
  communityHeaderSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  communityHeaderSettingsButtonIcon: {
    fontFamily: 'Circular-Book',
    color: white,
    marginRight: 6,
    fontSize: 16
  },
  communityHeaderSettingsButtonText: {
    fontFamily: 'Circular-Book',
    color: white,
    fontSize: 18
  }
}
