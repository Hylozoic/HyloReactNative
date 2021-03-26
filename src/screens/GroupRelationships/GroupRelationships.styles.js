import { StyleSheet } from 'react-native'
import { isIOS } from 'util/platform'
import {
  bigStone, rhino, rhino50, persimmon, rhino40, black10onRhino, white, rhino30, rhino10, rhino60, rhino80
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
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  groupRowText: {
    fontWeight: 'bold'
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
