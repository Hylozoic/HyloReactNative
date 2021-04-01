import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'
import {
  bigStone, rhino, rhino50, persimmon, rhino40, black10onRhino, white, rhino30, rhino10, rhino60, rhino80, rhino20
} from 'style/colors'

export default {
  container: {
    flex: 1
  },
  sectionHeader: {
    fontWeight: 'bold',
    padding: 15,
    fontSize: 18
  },
  groupRow: {
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: rhino60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupAvatar: {
    height: 42,
    width: 42,
    marginHorizontal: 10
  },
  groupRowRight: {
    marginRight: 82
  },
  groupRowText: {
    fontWeight: 'bold',
  },
  groupRowCounts: {
    color: rhino60,
    fontSize: 12,
    marginBottom: 5
  },
  groupRowDescription: {
    color: rhino80
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
  }
}