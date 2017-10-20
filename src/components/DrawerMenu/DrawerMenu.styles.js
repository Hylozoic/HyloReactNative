import mixins from '../../style/mixins'
import { bigStone, mirage, rhino, rhino50 } from '../../style/colors'

export default {
  parent: {
    ...mixins.belowStatusBar,
    flex: 1,
    backgroundColor: rhino
  },
  menu: {
    flex: 1,
    paddingHorizontal: 20
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
    marginBottom: 10
  },
  sectionHeaderText: {
    color: rhino50,
    fontFamily: 'Circular-Book',
    fontSize: 12
  },
  communityRow: {
    paddingVertical: 10
  },
  communityRowTouchable: {
    flexDirection: 'row',
    alignItems: 'center'
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
    flex: 1
  },
  text: {
    color: 'white'
  }
}
