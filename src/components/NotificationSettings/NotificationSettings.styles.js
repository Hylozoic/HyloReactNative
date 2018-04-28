import { StyleSheet } from 'react-native'
import { gunsmoke, rhino30, rhino80, caribbeanGreen, white60onCaribbeanGreen, amaranth, treePoppy } from 'style/colors'

const row = {
  flexDirection: 'row'
}

export default {
  scrollContainer: {
    marginTop: 30
  },
  row,
  settingsRow: {
    marginHorizontal: 17
  },
  nameRow: {
    ...row,
    height: 38
  },
  name: {
    fontFamily: 'Circular-Book',
    fontSize: 17
  },
  iconRow: {
    ...row,
    height: 50,
    marginLeft: 38,
    marginBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: rhino30
  },
  communityAvatar: {
    height: 22,
    width: 22,
    borderRadius: 4,
    marginRight: 9
  },
  arrowWrapper: {
    marginLeft: 'auto'
  },
  arrowIcon: {
    fontSize: 20,
    color: rhino30
  },
  icon: {
    fontSize: 46,
    marginRight: 25,
    marginBottom: 12
  },
  highlightIcon: {
    color: treePoppy
  }
}
