import { StyleSheet } from 'react-native'
import { rhino, white } from 'style/colors'

export default {
  container: {
    backgroundColor: white,
    flex: 1,
    padding: 20
  },
  divider: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: rhino
  },
  navItem: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  navItemIcon: {
    fontSize: 24,
    paddingRight: 10
  },
  navItemLabel: {
    fontSize: 24
  }
}
